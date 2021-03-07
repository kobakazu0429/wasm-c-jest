import { asmLibraryArg, preRun } from "./em";
import * as fs from "fs";
import * as path from "path";
import { Instance, ImportObject } from "./syscall";
// import { stdin } from "./Stdin";

let instance: Instance;
// const memory = new WebAssembly.Memory({ initial: 10, maximum: 10000 });

const importObject: ImportObject = {
  env: {
    // __syscall0: n => call(instance, n, []),
    // __syscall1: (n, ...args) => call(instance, n, args),
    // __syscall2: (n, ...args) => call(instance, n, args),
    // __syscall3: (n, ...args) => call(instance, n, args),
    // __syscall4: (n, ...args) => call(instance, n, args),
    // __syscall5: (n, ...args) => call(instance, n, args),
    // __syscall6: (n, ...args) => call(instance, n, args),
    // putc_js: c => {
    //   const s = String.fromCharCode(c);
    //   if (s === "\n") {
    //     console.log(stdin.str);
    //     stdin.clear();
    //   } else {
    //     stdin.add(s);
    //   }
    // },
    // getc_js: i => {
    //   if (stdin.str.length > i) {
    //     return stdin.str.charCodeAt(i);
    //   } else if (stdin.str.length === i) {
    //     stdin.clear();
    //     return "\n".charCodeAt(0);
    //   }
    //   return 0;
    // },
    // @ts-ignore
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 256
    }),

    table: new WebAssembly.Table({
      initial: 0,
      element: "anyfunc"
    }),
    ...asmLibraryArg
  },
  wasi_snapshot_preview1: asmLibraryArg
  // js: { mem: memory }
};

const wasmPath = path.relative(
  __dirname,
  path.join(__dirname, ".tmp/generated.wasm")
);

export const main = async () => {
  try {
    const bytes = fs.readFileSync(wasmPath);
    preRun();
    const results = await WebAssembly.instantiate(bytes, importObject);
    instance = (results.instance as any) as Instance;
    instance.exports.main();
  } catch (e) {
    console.error(e);
  }
};

main();
