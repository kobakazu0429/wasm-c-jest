import { syscall as call, Instance, ImportObject } from "./syscall";
// @ts-ignore
import { Service } from "@wasm/studio-utils";
import { stdin } from "./Stdin";
import { decodeBinary } from "./utils";

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

const src = String.raw`#include <stdio.h>
#include <sys/uio.h>

#define WASM_EXPORT __attribute__((visibility("default")))

int add(int a, int b)
{
  return a + b;
}

WASM_EXPORT
int main()
{
  int a = 0;
  int b = 0;
  scanf("%d", &a);
  scanf("%d", &b);
  printf("%d + %d = %d\n", a, b, add(a, b));
  return 0;
}


extern void putc_js(char ch);

WASM_EXPORT
size_t writev_c(int fd, const struct iovec *iov, int iovcnt)
{
  size_t cnt = 0;
  for (int i = 0; i < iovcnt; i++)
  {
    for (int j = 0; j < iov[i].iov_len; j++)
    {
      putc_js(((char *)iov[i].iov_base)[j]);
    }
    cnt += iov[i].iov_len;
  }
  return cnt;
}

extern char getc_js(int index);

WASM_EXPORT
size_t readv_c(int fd, const struct iovec *iov, int iovcnt)
{
  size_t cnt = 0;
  for (int i = 0; i < iovcnt; i++)
  {
    for (int j = 0; j < iov[i].iov_len; j++)
    {
      char s = getc_js(j);
      ((char *)iov[i].iov_base)[j] = s;
      if (s != 0) cnt++;
    }
  }
  return cnt;
}
`;

function atob(str: string) {
  return Buffer.from(str, "base64").toString();
}

export const main = async () => {
  try {
    console.log("Compile Start...");
    const result = await Service.compile(src, "c", "wasm", "-g -O3");
    if (!result.success) return;
    const content = await decodeBinary(result.output);
    console.log(content);

    const buffer = atob(result.output);

    console.log(buffer);

    let data = new Uint8Array(buffer.length);
    for (let i = buffer.length; i !== 0; i--) {
      data[i] = buffer.charCodeAt(i);
    }
    // const wasomModule = new WebAssembly.Module(buffer);
    // const wasomModule = new WebAssembly.Module(data.reverse().buffer);
    const results = await WebAssembly.instantiate(data.buffer, importObject);
    // const results = await WebAssembly.instantiate(wasomModule, importObject);
    // const results = await WebAssembly.instantiate(data, importObject);
    // const results = await WebAssembly.instantiate(content, importObject);
    // @ts-ignore
    instance = (results.instance as any) as Instance;
    console.log("Compile finish ! Start now");
    instance.exports.main();
  } catch (e) {
    console.error(e);
  }
};

main();
