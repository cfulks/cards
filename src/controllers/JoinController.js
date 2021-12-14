import path from "path";

class JoinController {
  /**
   * Handles sending the file for the lobby for Blackjack
   * @returns response with file sent
   */
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "join.html")
    );
  }
}

export default JoinController;
