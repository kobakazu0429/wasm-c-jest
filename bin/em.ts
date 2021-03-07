const INITIAL_INITIAL_MEMORY = 16777216;
const WASM_PAGE_SIZE = 65536;

const memory = new WebAssembly.Memory({
  initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
  maximum: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
});

// const setTempRet0 = () => {};
const table = new WebAssembly.Table({
  initial: 6,
  maximum: 6 + 0,
  element: "anyfunc"
});

// let HEAP8: Int8Array;
let HEAPU8: Uint8Array;
// let HEAP16: Int16Array;
// let HEAPU16: Uint16Array;
let HEAP32: Int32Array;
// let HEAPU32: Uint32Array;
// let HEAPF32: Float32Array;
// let HEAPF64: Float64Array;

function updateGlobalBufferAndViews(buf: ArrayBuffer) {
  // HEAP8 = new Int8Array(buf);
  // HEAP16 = new Int16Array(buf);
  HEAP32 = new Int32Array(buf);
  HEAPU8 = new Uint8Array(buf);
  // HEAPU16 = new Uint16Array(buf);
  // HEAPU32 = new Uint32Array(buf);
  // HEAPF32 = new Float32Array(buf);
  // HEAPF64 = new Float64Array(buf);
}

const abort = (msg: string) => {
  throw Error(msg);
};
const assert = (condition: any, text?: any) => {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
};

const __handle_stack_overflow = () => {
  abort("__handle_stack_overflow");
};

const emscripten_get_sbrk_ptr = () => {
  return 3616;
};

const emscripten_memcpy_big = (dest: number, src: number, num: number) => {
  HEAPU8.copyWithin(dest, src, src + num);
};

const emscripten_resize_heap = () => {
  abort("emscripten_resize_heap");
};

const UTF8Decoder = new TextDecoder("utf8");
type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;

function UTF8ArrayToString(
  heap: TypedArray,
  idx: number,
  maxBytesToRead = 0
): string {
  let endIdx = idx + maxBytesToRead;
  let endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heap.subarray) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    let str = "";
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      let u0 = heap[idx++];
      if (!(u0 & 0x80)) {
        str += String.fromCharCode(u0);
        console.log(str);
        continue;
      }
      let u1 = heap[idx++] & 63;
      if ((u0 & 0xe0) === 0xc0) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        console.log(str);
        continue;
      }
      let u2 = heap[idx++] & 63;
      if ((u0 & 0xf0) === 0xe0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 0xf8) !== 0xf0) {
          console.warn(
            "Invalid UTF-8 leading byte 0x" +
              u0.toString(16) +
              " encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!"
          );
        }
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
        console.log(String.fromCharCode(u0));
        console.log(str);
      } else {
        let ch = u0 - 0x10000;

        str += String.fromCharCode(0xd800 | (ch >> 10), 0xdc00 | (ch & 0x3ff));
        console.log(
          String.fromCharCode(0xd800 | (ch >> 10), 0xdc00 | (ch & 0x3ff))
        );
        console.log(str);
      }
    }
  }
  // @ts-ignore
  console.log(str);
  // @ts-ignore
  return str;
}

function UTF8ToString(ptr: number, maxBytesToRead?: number): string {
  console.log(ptr);
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}

const printChar = (stream: number, curr: number) => {
  let buffer = SYSCALLS.buffers[stream] as any;
  if (curr === 0 || curr === 10) {
    console.log(stream === 1);
    console.log(buffer);
    (stream === 1 ? console.log : console.warn)(UTF8ArrayToString(buffer, 0));
    buffer.length = 0;
  } else {
    buffer.push(curr);
  }
};
const get = () => {
  assert(SYSCALLS.varargs !== undefined);
  (SYSCALLS.varargs as number) += 4;
  let ret = HEAP32[((SYSCALLS.varargs as number) - 4) >> 2];
  return ret;
};
const getStr = (ptr: number) => {
  let ret = UTF8ToString(ptr, undefined);
  return ret;
};
const get64 = (low: any, high: any) => {
  if (low >= 0) assert(high === 0);
  else assert(high === -1);
  return low;
};

let varargs: undefined | number;

const SYSCALLS = {
  mappings: {},
  buffers: [null, [], []],
  printChar,
  varargs,
  get,
  getStr,
  get64
};
const fd_write = (fd: number, iov: number, iovcnt: number, pnum: number) => {
  // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
  let num = 0;
  for (let i = 0; i < iovcnt; i++) {
    let ptr = HEAP32[(iov + i * 8) >> 2];
    let len = HEAP32[(iov + (i * 8 + 4)) >> 2];
    for (let j = 0; j < len; j++) {
      console.log(fd);
      console.log(HEAPU8[ptr + j]);

      SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
    }
    num += len;
  }
  HEAP32[pnum >> 2] = num;
  return 0;
};

export const preRun = () => {
  updateGlobalBufferAndViews(memory.buffer);
};

export const asmLibraryArg = {
  __handle_stack_overflow,
  emscripten_get_sbrk_ptr,
  emscripten_memcpy_big,
  emscripten_resize_heap,
  fd_write,
  memory,
  // setTempRet0,
  table
};
