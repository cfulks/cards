import path from "path";

class ErrorController {
  static get(req, res, next) {
    return res
      .status(404)
      .sendFile(path.join(path.resolve(), "/src/views/error.html"));
  }
}

export default ErrorController;
