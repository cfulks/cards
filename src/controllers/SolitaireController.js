import path from "path";

class SolitaireController {
  /**
   * Handles sending the file for the Solitaire game
   * @returns response with file sent
   */
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "solitaire.html")
    );
  }
}

export default SolitaireController;
