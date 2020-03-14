import * as fs from "fs";
import * as path from "path";
import MagicString from "magic-string";

const filename = process.argv[2];

if (!filename) {
  throw new Error(
    "Error: input file path is required\n$ yarn start <input file path>"
  );
}

const targetFilePath = path.join(__dirname, path.relative(__dirname, filename));
const outputFilePath = path.join(__dirname, "../.tmp/generated.c");

const mainFuncExternPattern = /int main\s*\((.*|\s*)\)/g;

const insertToTopContents = `#include <sys/uio.h>
#define WASM_EXPORT __attribute__((visibility("default")))

`;

// ref: http://man7.org/linux/man-pages/man2/writev.2.html
const insertToBottomContents = `
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

fs.readFile(targetFilePath, (err, result) => {
  if (err) throw err;

  const source = result.toString();
  const magicString = new MagicString(result.toString());

  let match = mainFuncExternPattern.exec(source);
  while (match) {
    magicString.appendLeft(match.index, "WASM_EXPORT\n");
    match = mainFuncExternPattern.exec(source);
  }

  magicString.prepend(insertToTopContents);
  magicString.append(insertToBottomContents);

  const transpiled = magicString.toString();

  fs.writeFileSync(outputFilePath, transpiled);
});
