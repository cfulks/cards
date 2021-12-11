import { expect, it, jest } from "@jest/globals";
import BlackjackController from "../../src/controllers/BlackjackController";

const res = {
  sendFile: jest.fn((filePath) => filePath), // We just want to return the path instead of the file
};

describe("BlackjackController", () => {
  it("should return blackjack.html", () => {
    let result = BlackjackController.get(undefined, res, undefined);
    expect(res.sendFile.mock.calls.length).toBe(1);
    expect(result).toMatch(/src(\/|\\)views(\/|\\)html(\/|\\)blackjack\.html$/);
  });

  it("should return callback", () => {
    expect(BlackjackController.hit(undefined)).toBeInstanceOf(Function);
  });
});
