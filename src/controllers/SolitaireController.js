import path from "path";

class SolitaireController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "solitaire.html")
    );
  }
}

export default SolitaireController;
