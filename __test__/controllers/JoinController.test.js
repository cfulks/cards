import { expect, it, jest } from "@jest/globals";
import JoinController from "../../src/controllers/JoinController";

const res = {
  sendFile: jest.fn((filePath) => filePath), // We just want to return the path instead of the file
};

describe("JoinController", () => {
  it("should return join.html", () => {
    let result = JoinController.get(undefined, res, undefined);
    expect(res.sendFile.mock.calls.length).toBe(1);
    expect(result).toMatch(/src(\/|\\)views(\/|\\)html(\/|\\)join\.html$/);
  });
});
