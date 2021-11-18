import express from "express";

import HomeController from "../controllers/HomeController.js";
import SolitaireController from "../controllers/SolitaireController.js";
import ErrorController from "../controllers/ErrorController.js";
import BlackjackController from "../controllers/BlackjackController.js";

/**
 * Creates routes for the website
 * @param {Express} app
 * @returns app
 */
const routes = (app) => {
  app.use(express.static("public"));
  app.get("/", HomeController.get);
  app.get("/solitaire", SolitaireController.get);
  app.get("/blackjack", BlackjackController.get);
  app.get("*", ErrorController.get);

  return app;
};

export default routes;
