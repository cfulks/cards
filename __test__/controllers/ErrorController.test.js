import { expect, it, jest } from "@jest/globals";
import ErrorController from "../../src/controllers/ErrorController";

const res = {
  sendFile: jest.fn((filePath) => filePath), // We just want to return the path instead of the file
  status: jest.fn(() => res),
};

describe("ErrorController", () => {
  it("should return error.html", () => {
    let result = ErrorController.get(undefined, res, undefined);
    expect(res.sendFile.mock.calls.length).toBe(1);
    expect(result).toMatch(/src\/views\/error\.html$/);
  });
});
