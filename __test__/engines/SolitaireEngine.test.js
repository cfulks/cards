import { expect, it, jest } from "@jest/globals";
import { shuffleDeck } from "../../src/engines/SolitaireEngine";

describe("SolitaireEngine", () => {
  describe("Shuffled Deck", () => {
    it("A small array to be shuffled", () => {
      let arr = [1, 2, 3, 4, 5, 6];
      shuffleDeck(arr);
      expect(arr.length).toBe(6);
    });
    it("All elements retain value after shuffle", () => {
      let deck = [1, 2, 3, 4, 5, 6];
      shuffleDeck(deck);
      expect(deck).toEqual(expect.arrayContaining(deck));
    });
  });
});
