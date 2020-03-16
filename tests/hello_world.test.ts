import { main } from "../bin/start";

const spyLog = jest.spyOn(console, "log");
spyLog.mockImplementation(_x => undefined);

describe("hello_world", () => {
  afterEach(() => {
    spyLog.mockClear();
  });
  afterAll(() => {
    spyLog.mockReset();
    spyLog.mockRestore();
  });

  test("should say 'Hello, World!'.", async done => {
    return main().then(() => {
      expect(spyLog.mock.calls[0][0]).toBe("Hello, World!");
      expect(console.log).toBeCalled();
      done();
    });
  });
});
