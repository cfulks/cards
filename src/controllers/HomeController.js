import path from "path";

class HomeController {
  /**
   * Handles sending the file for the Home page
   * @returns response with file sent
   */
  static get(req, res, next) {
    return res.sendFile(
      path.join(path.resolve(), "src", "views", "html", "index.html")
    );
  }
}

export default HomeController;
