import express from "express";

import HomeController from "../controllers/HomeController.js";
import SolitaireController from "../controllers/SolitaireController.js";
import ErrorController from "../controllers/ErrorController.js";
import BlackjackController from "../controllers/BlackjackController.js";
import JoinController from "../controllers/JoinController.js";

/**
 * Creates routes for the website
 * @param {Express} app
 * @returns app
 */
const routes = (app) => {
  app.use(express.static("public"));
  app.get("/", HomeController.get);
  app.get("/solitaire", SolitaireController.get);
  app.get("/blackjack/:id", BlackjackController.get);
  app.get("/blackjack", JoinController.get);
  app.get("*", ErrorController.get);

  return app;
};

export default routes;
