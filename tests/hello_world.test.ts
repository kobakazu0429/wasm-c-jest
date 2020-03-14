import { main } from "../bin/start";

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(x => x);

describe("hello_world", () => {
  test("should say 'Hello, World'.", () => {
    main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("Hello, World!");
      expect(console.log).toBeCalled();
      spyLog.mockReset();
      spyLog.mockRestore();
    });
  });
});
