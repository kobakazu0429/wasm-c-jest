import * as fs from "fs";
import * as path from "path";
import { syscall as call, Instance, ImportObject } from "./syscall";

let instance: Instance;
let str = "52\n25\n";

const importObject: ImportObject = {
  env: {
    __syscall0: n => call(instance, n, []),
    __syscall1: (n, a) => call(instance, n, [a]),
    __syscall2: (n, a, b) => call(instance, n, [a, b]),
    __syscall3: (n, a, b, c) => call(instance, n, [a, b, c]),
    __syscall4: (n, a, b, c, d) => call(instance, n, [a, b, c, d]),
    __syscall5: (n, a, b, c, d, e) => call(instance, n, [a, b, c, d, e]),
    __syscall6: (n, a, b, c, d, e, f) => call(instance, n, [a, b, c, d, e, f]),
    putc_js: c => {
      const s = String.fromCharCode(c);
      if (s === "\n") {
        console.log(str);
        str = "";
      } else {
        str += s;
      }
    },
    getc_js: i => {
      if (str.length > i) {
        return str.charCodeAt(i);
      }
      return 0;
    }
  }
};

const wasmPath = path.relative(
  __dirname,
  path.join(__dirname, ".tmp/generated.wasm")
);

const main = async () => {
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
