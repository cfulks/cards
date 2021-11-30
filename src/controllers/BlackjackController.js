import path from "path";

class BlackjackController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "blackjack.html")
    );
  }

  static hit(callback) {
    callback(1, "hearts", "Red");
  }
}

export default BlackjackController;
