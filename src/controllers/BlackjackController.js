import path from "path";
import BlackjackEngine from "../engines/BlackjackEngine.js";

class BlackjackController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "blackjack.html")
    );
  }

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

  static stand(gameId, socketId) {
    return () => {
      if (BlackjackEngine.getGame(gameId).currentTurn(socketId)) {
        BlackjackEngine.getGame(gameId).stand(socketId);
        BlackjackEngine.getGame(gameId).updateGame();
      }
    };
  }

  static bet(gameId, socketId) {
    return (amount, callback) => {
      let success = BlackjackEngine.getGame(gameId).bet(socketId, amount);
      callback(success);
      BlackjackEngine.getGame(gameId).updateGame();
    };
  }
}

export default BlackjackController;
