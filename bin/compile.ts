// import * as path from "path";
// @ts-ignore
import { Service, project } from "@wasm/studio-utils";

// const targetFilePath = path.relative(
//   __dirname,
//   path.join(__dirname, "../.tmp/generated.c")
// );
// const outputFilePath = path.relative(
//   __dirname,
//   path.join(__dirname, "../.tmp/generated.wasm")
// );

(async () => {
  const data = await Service.compileFile(
    project.getFile(".tmp/generated.c"),
    "c",
    "wasm",
    "-g -O3"
  );
  const outWasm = project.newFile(".tmp/generated.wasm", "wasm", true);
  outWasm.setData(data);
})();
