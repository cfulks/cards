import { expect, it, jest } from "@jest/globals";
import SolitaireController from "../../src/controllers/SolitaireController";

const res = {
    sendFile: jest.fn((filePath) => filePath), // We just want to return the path instead of the file
};

describe("SolitaireController", () => {
  it("should return blackjack.html", () => {
    let result = SolitaireController.get(undefined, res, undefined);
    expect(res.sendFile.mock.calls.length).toBe(1);
    expect(result).toMatch(/src(\/|\\)views(\/|\\)solitaire\.html$/);
  });
});
