import path from "path";

class HomeController {
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "index.html")
    );
  }
}

export default HomeController;
