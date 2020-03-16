import { main } from "../bin/start";
import * as rs from "readline-sync";
jest.mock("readline-sync");

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(_x => undefined);

describe("fizzbuzz", () => {
  afterEach(() => {
    spyLog.mockClear();
  });
  afterAll(() => {
    spyLog.mockReset();
    spyLog.mockRestore();
  });

  test("from 1, to 30", async done => {
    jest.spyOn(rs, "prompt").mockReturnValueOnce("30");

    return main().then(() => {
      /* i =  1 */ expect(spyLog.mock.calls[0][0]).toBe("1");
      /* i =  2 */ expect(spyLog.mock.calls[1][0]).toBe("2");
      /* i =  3 */ expect(spyLog.mock.calls[2][0]).toBe("Fizz");
      /* i =  4 */ expect(spyLog.mock.calls[3][0]).toBe("4");
      /* i =  5 */ expect(spyLog.mock.calls[4][0]).toBe("Buzz");
      /* i =  6 */ expect(spyLog.mock.calls[5][0]).toBe("Fizz");
      /* i =  7 */ expect(spyLog.mock.calls[6][0]).toBe("7");
      /* i =  8 */ expect(spyLog.mock.calls[7][0]).toBe("8");
      /* i =  9 */ expect(spyLog.mock.calls[8][0]).toBe("Fizz");
      /* i = 10 */ expect(spyLog.mock.calls[9][0]).toBe("Buzz");
      /* i = 11 */ expect(spyLog.mock.calls[10][0]).toBe("11");
      /* i = 12 */ expect(spyLog.mock.calls[11][0]).toBe("Fizz");
      /* i = 13 */ expect(spyLog.mock.calls[12][0]).toBe("13");
      /* i = 14 */ expect(spyLog.mock.calls[13][0]).toBe("14");
      /* i = 15 */ expect(spyLog.mock.calls[14][0]).toBe("FizzBuzz");
      expect(console.log).toBeCalled();
      done();
    });
  });
});
