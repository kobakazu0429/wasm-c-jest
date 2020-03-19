import * as fs from "fs";
import * as path from "path";
import { syscall as call, Instance, ImportObject } from "./syscall";
import { stdin } from "./Stdin";

let instance: Instance;

const importObject: ImportObject = {
  env: {
    __syscall0: n => call(instance, n, []),
    __syscall1: (n, ...args) => call(instance, n, args),
    __syscall2: (n, ...args) => call(instance, n, args),
    __syscall3: (n, ...args) => call(instance, n, args),
    __syscall4: (n, ...args) => call(instance, n, args),
    __syscall5: (n, ...args) => call(instance, n, args),
    __syscall6: (n, ...args) => call(instance, n, args),
    putc_js: c => {
      const s = String.fromCharCode(c);
      if (s === "\n") {
        console.log(stdin.str);
        stdin.clear();
      } else {
        stdin.add(s);
      }
    },
    getc_js: i => {
      if (stdin.str.length > i) {
        return stdin.str.charCodeAt(i);
      } else if (stdin.str.length === i) {
        stdin.clear();
        return "\n".charCodeAt(0);
      }
      return 0;
    }
  }
};

const wasmPath = path.relative(
  __dirname,
  path.join(__dirname, ".tmp/generated.wasm")
);

export const main = async () => {
  try {
    const bytes = fs.readFileSync(wasmPath);
    const results = await WebAssembly.instantiate(bytes, importObject);
    instance = (results.instance as any) as Instance;
    instance.exports.main();
  } catch (e) {
    console.error(e);
  }
};

main();
