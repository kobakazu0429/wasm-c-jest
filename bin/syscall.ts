export interface ImportObject extends WebAssembly.Imports {
  env: {
    __syscall0: Syscall0;
    __syscall1: Syscall1;
    __syscall2: Syscall2;
    __syscall3: Syscall3;
    __syscall4: Syscall4;
    __syscall5: Syscall5;
    __syscall6: Syscall6;
    putc_js: (c: number) => void;
    getc_js: (i: number) => number;
  };
}

export interface Instance extends WebAssembly.Instance {
  exports: {
    readv_c: (arg1: number, arg2: number, arg3: number) => number;
    writev_c: (arg1: number, arg2: number, arg3: number) => number;
    main: () => void;
    memory: WebAssembly.Memory;
  };
}

let memoryStates = new WeakMap();

// ref: n is syscall number,
// * https://syscalls.kernelgrok.com/
// * https://www.informatik.htw-dresden.de/~beck/ASM/syscall_list.html
export function syscall(instance: Instance, n: number, args: number[]): any {
  switch (n) {
    default:
      // console.log("Syscall " + n + " NYI.");
      break;
    case /* brk */ 45:
      return 0;
    case /* readv */ 145:
      // console.log("called 145");
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

type Syscall0 = (n: number) => any;
type Syscall1 = (n: number, a: number) => any;
type Syscall2 = (n: number, a: number, b: number) => any;
type Syscall3 = (n: number, a: number, b: number, c: number) => any;
type Syscall4 = (n: number, a: number, b: number, c: number, d: number) => any;
type Syscall5 = (
  n: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number
) => any;
type Syscall6 = (
  n: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
) => any;
