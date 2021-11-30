import express from "express";
import routes from "./routes/routes.js";

const app = routes(express());
app.listen(process.env.PORT);
