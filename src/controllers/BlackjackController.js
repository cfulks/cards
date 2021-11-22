import path from "path";

class BlackjackController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "blackjack.html")
    );
  }
}

export default BlackjackController;
