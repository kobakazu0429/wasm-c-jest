import { main } from "../bin/start";
import * as rs from "readline-sync";
jest.mock("readline-sync");

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(x => x);

describe("hi_your_name", () => {
  test("input: 'kazu', should be 'Hi, kazu'", done => {
    jest.spyOn(rs, "prompt").mockReturnValue("kazu\n");

    main()
      .then(() => {
        expect(spyLog.mock.calls[0][0]).toBe("Hi, kazu");
        expect(console.log).toBeCalled();
      })
      .finally(() => {
        spyLog.mockReset();
        spyLog.mockRestore();
        done();
      });
  });

  test("input: 'kazuhiro kobatake', should be 'Hi, '", done => {
    jest.spyOn(rs, "prompt").mockReturnValue("kazuhiro kobatake\n");

    main()
      .then(() => {
        expect(spyLog.mock.calls[0][0]).toBe("Hi, kazuhiro");
        expect(spyLog.mock.calls[0][0]).not.toBe("Hi, kazuhiro kobatake");
        expect(console.log).toBeCalled();
      })
      .finally(() => {
        spyLog.mockReset();
        spyLog.mockRestore();
        done();
      });
  });
});
