import path from "path";

class ErrorController {
  /**
   * Handles sending the file for any unknown page
   * @returns response with file sent
   */
  static get(req, res, next) {
    return res
      .status(404)
      .sendFile(
        path.join(path.resolve(), "src", "views", "html", "error.html")
      );
  }
}

export default ErrorController;
