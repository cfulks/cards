import path from "path";
import BlackjackEngine from "../engines/BlackjackEngine.js";

class BlackjackController {
  /**
   * Handles sending the file for the Blackjack game
   * @returns response with file sent
   */
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "blackjack.html")
    );
  }

  /**
   * Allow a player to draw a card once the round is over and then move on to the next player
   * @param {String} gameId id of the blackjack game
   * @param {String} socketId id of the player
   * @returns a function to allow hitting for socket events
   */
  static hit(gameId, socketId) {
    return () => {
      if (
        BlackjackEngine.getGame(gameId).currentTurn(socketId) &&
        BlackjackEngine.getGame(gameId).calculateCardValue(
          BlackjackEngine.getGame(gameId).players[socketId].hand
        ) < 21
      ) {
        BlackjackEngine.getGame(gameId).players[socketId].drawCard = true;
        BlackjackEngine.getGame(gameId).updateGame();
      }
    };
  }

  /**
   * Stop a player from hitting/betting anymore updates all other players.
   * @param {String} gameId id of the blackjack game
   * @param {String} socketId id of the player
   * @returns a function to allow standing for socket events
   */
  static stand(gameId, socketId) {
    return () => {
      if (BlackjackEngine.getGame(gameId).currentTurn(socketId)) {
        BlackjackEngine.getGame(gameId).stand(socketId);
        BlackjackEngine.getGame(gameId).updateGame();
      }
    };
  }

  /**
   * Allow a player to bet an amount.
   * @param {String} gameId id of the blackjack game
   * @param {String} socketId id of the player
   * @returns a function to allow betting for socket events
   */
  static bet(gameId, socketId) {
    return (amount, callback) => {
      let success = BlackjackEngine.getGame(gameId).bet(socketId, amount);
      callback(success);
      BlackjackEngine.getGame(gameId).updateGame();
    };
  }
}

export default BlackjackController;
