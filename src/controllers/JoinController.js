import path from "path";

class JoinController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "join.html")
    );
  }
}

export default JoinController;
