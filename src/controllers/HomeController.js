import path from "path";

class HomeController {
  static get(req, res, next) {
    return res.sendFile(path.join(path.resolve(), "/src/views/index.html"));
  }
}

export default HomeController;
