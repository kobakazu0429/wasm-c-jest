import { main } from "../bin/start";
import * as rs from "readline-sync";
jest.mock("readline-sync");

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(_x => undefined);

describe("hi_your_name", () => {
  afterEach(() => {
    spyLog.mockClear();
  });
  afterAll(() => {
    spyLog.mockReset();
    spyLog.mockRestore();
  });

  test("input: 'kazu', should be 'Hi, kazu'", async done => {
    jest.spyOn(rs, "prompt").mockReturnValue("kazu\n");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("Hi, kazu");
      expect(console.log).toBeCalled();
      done();
    });
  });

  test("input: 'kazuhiro kobatake', should be 'Hi, '", async done => {
    jest.spyOn(rs, "prompt").mockReturnValue("kazuhiro kobatake\n");

    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("Hi, kazuhiro");
      expect(spyLog.mock.calls[0][0]).not.toBe("Hi, kazuhiro kobatake");
      expect(console.log).toBeCalled();
      done();
    });
  });
});
