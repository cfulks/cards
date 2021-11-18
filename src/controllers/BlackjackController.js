import path from "path";

class BlackjackController {
  static get(req, res, next) {
    return res.sendFile(path.join(path.resolve(), "/src/views/blackjack.html"));
  }
}

export default BlackjackController;
