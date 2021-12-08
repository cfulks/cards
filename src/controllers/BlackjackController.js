import path from "path";

class BlackjackController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "blackjack.html")
    );
  }

  static hit(id) {
    return (callback) => {
      // Something like BlackjackEngine.getGame(id).drawCard(player)
      // then use callback for sending the card back to the player
      // Other players should be sent a blank card ("0 card back")
      callback(1, "hearts", "Red");
    };
  }
}

export default BlackjackController;
