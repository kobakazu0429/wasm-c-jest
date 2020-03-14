import { main } from "../bin/start";
import * as rs from "readline-sync";
jest.mock("readline-sync");

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(x => x);

describe("hi_your_name", () => {
  test("input: 'kazu', should be 'Hi, kazu'", () => {
    jest.spyOn(rs, "prompt").mockReturnValue("kazu\n");

    main().finally(() => {
      expect(spyLog.mock.calls[0][0]).toBe("Hi, kazu");
      expect(console.log).toBeCalled();
      spyLog.mockReset();
      spyLog.mockRestore();
    });
  });

  // test("input: '', should be 'Hi, '", () => {
  //   jest.spyOn(rs, "prompt").mockReturnValue("");

  //   main().finally(() => {
  //     expect(spyLog.mock.calls[0][0]).toBe("Hi, ");
  //     expect(console.log).toBeCalled();
  //     spyLog.mockReset();
  //     spyLog.mockRestore();
  //   });
  // });
});
