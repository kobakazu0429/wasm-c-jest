// https://hackmd.io/zgucKrShTcWE8NTcJJJ8jA

import { main } from "../bin/start";
import * as rs from "readline-sync";
jest.mock("readline-sync");

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(_x => undefined);

describe("add", () => {
  afterEach(() => {
    spyLog.mockClear();
  });
  afterAll(() => {
    spyLog.mockReset();
    spyLog.mockRestore();
  });

  test("入力例 1", async done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("1080")
      .mockReturnValueOnce("1920")
      .mockReturnValueOnce("1080")
      .mockReturnValueOnce("1920");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("YES");
      expect(console.log).toBeCalled();
      done();
    });
  });

  test("入力例 2", async done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("1080")
      .mockReturnValueOnce("1920")
      .mockReturnValueOnce("1920")
      .mockReturnValueOnce("1080");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("YES");
      expect(console.log).toBeCalled();
      done();
    });
  });

  test("入力例 3", async done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("334")
      .mockReturnValueOnce("668")
      .mockReturnValueOnce("668")
      .mockReturnValueOnce("1002");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("YES");
      expect(console.log).toBeCalled();
      done();
    });
  });

  test("入力例 4", async done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("100")
      .mockReturnValueOnce("200")
      .mockReturnValueOnce("300")
      .mockReturnValueOnce("150");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("NO");
      expect(console.log).toBeCalled();
      done();
    });
  });

  test("入力例 5", async done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("120")
      .mockReturnValueOnce("120")
      .mockReturnValueOnce("240")
      .mockReturnValueOnce("240");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("NO");
      expect(console.log).toBeCalled();
      done();
    });
  });
});
