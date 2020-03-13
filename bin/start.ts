import * as fs from "fs";
import * as path from "path";
// import * as readline from "readline";

// @ts-ignore
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// const getLine = (() => {
//   const getLineGen = (async function*() {
//     for await (const line of rl) {
//       yield line;
//     }
//   })();
//   return async () => (await getLineGen.next()).value;
// })();

const wasmPath = path.relative(
  __dirname,
  path.join(__dirname, ".tmp/generated.wasm")
);

interface Instance extends WebAssembly.Instance {
  exports: {
    readv_c: (arg1: number, arg2: number, arg3: number) => number;
    writev_c: (arg1: number, arg2: number, arg3: number) => number;
    main: () => void;
    memory: WebAssembly.Memory;
  };
}

const bytes = fs.readFileSync(wasmPath);

let instance: Instance | null = null;
let memoryStates = new WeakMap();

function syscall(n: number, args: number[]) {
  if (!instance) {
    console.log("instance is null");
    return null;
  }
  // console.log("syscall");

  // ref: n is syscall number,
  // * https://syscalls.kernelgrok.com/
  // * https://www.informatik.htw-dresden.de/~beck/ASM/syscall_list.html
  switch (n) {
    default:
      // console.log("Syscall " + n + " NYI.");
      break;
    case /* brk */ 45:
      return 0;
    case /* readv */ 145:
      // console.log("called 145");
      // await getLine();
      return instance.exports.readv_c(args[0], args[1], args[2]);
    case /* writev */ 146:
      // console.log("called 146");
      return instance.exports.writev_c(args[0], args[1], args[2]);
    case /* mmap2 */ 192:
      // debugger;
      const memory = instance.exports.memory;
      let memoryState = memoryStates.get(instance);
      const requested = args[1];
      if (!memoryState) {
        memoryState = {
          object: memory,
          currentPosition: memory.buffer.byteLength
        };
        memoryStates.set(instance, memoryState);
      }
      let cur = memoryState.currentPosition;
      if (cur + requested > memory.buffer.byteLength) {
        const need = Math.ceil(
          (cur + requested - memory.buffer.byteLength) / 65536
        );
        memory.grow(need);
      }
      memoryState.currentPosition += requested;
      return cur;
  }
}

let str = "52\n25\n";
// let x = 0;
WebAssembly.instantiate(bytes, {
  env: {
    __syscall0: function __syscall0(n: number) {
      return syscall(n, []);
    },
    __syscall1: function __syscall1(n: number, a: number) {
      return syscall(n, [a]);
    },
    __syscall2: function __syscall2(n: number, a: number, b: number) {
      return syscall(n, [a, b]);
    },
    __syscall3: function __syscall3(
      n: number,
      a: number,
      b: number,
      c: number
    ) {
      return syscall(n, [a, b, c]);
    },
    __syscall4: function __syscall4(
      n: number,
      a: number,
      b: number,
      c: number,
      d: number
    ) {
      return syscall(n, [a, b, c, d]);
    },
    __syscall5: function __syscall5(
      n: number,
      a: number,
      b: number,
      c: number,
      d: number,
      e: number
    ) {
      return syscall(n, [a, b, c, d, e]);
    },
    __syscall6: function __syscall6(
      n: number,
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ) {
      return syscall(n, [a, b, c, d, e, f]);
    },
    putc_js: (c: number) => {
      const s = String.fromCharCode(c);
      if (s === "\n") {
        console.log(str);
        str = "";
      } else {
        str += s;
      }
    },
    getc_js: (i: number) => {
      if (str.length > i) {
        return str.charCodeAt(i);
      }
      return 0;
    }
  }
})
  .then(results => {
    instance = (results.instance as any) as Instance;
    instance.exports.main();
  })
  .catch(console.error);
