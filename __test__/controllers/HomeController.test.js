import { expect, it, jest } from "@jest/globals";
import HomeController from "../../src/controllers/HomeController";

const res = {
  sendFile: jest.fn((filePath) => filePath), // We just want to return the path instead of the file
};

describe("HomeController", () => {
  it("should return index.html", () => {
    let result = HomeController.get(undefined, res, undefined);
    expect(res.sendFile.mock.calls.length).toBe(1);
    expect(result).toMatch(/src(\/|\\)views(\/|\\)html(\/|\\)index\.html$/);
  });
});
