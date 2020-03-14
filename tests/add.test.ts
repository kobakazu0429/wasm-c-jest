import { main } from "../bin/start";
import * as rs from "readline-sync";
jest.mock("readline-sync");

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(x => x);

describe("add", () => {
  test("1 + 2 = 3", done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("1")
      .mockReturnValueOnce("2");

    main()
      .then(() => {
        expect(spyLog.mock.calls[0][0]).toBe("1 + 2 = 3");
        expect(console.log).toBeCalled();
      })
      .finally(() => {
        spyLog.mockReset();
        spyLog.mockRestore();
        done();
      });
  });

  test("-5 + 3 = -2", done => {
    jest
      .spyOn(rs, "prompt")
      .mockReturnValueOnce("-5")
      .mockReturnValueOnce("3");

    main()
      .then(() => {
        expect(spyLog.mock.calls[0][0]).toBe("-5 + 3 = -2");
        expect(console.log).toBeCalled();
      })
      .finally(() => {
        spyLog.mockReset();
        spyLog.mockRestore();
        done();
      });
  });
});
