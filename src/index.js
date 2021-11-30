import express from "express";
import { Server } from "socket.io";
import routes from "./routes/routes.js";
import sockets from "./routes/sockets.js";

const app = routes(express());
const io = sockets(
  new Server({
    cors: {
      origin: "*",
    },
  })
);

app.listen(process.env.PORT);
io.listen(`${parseInt(process.env.PORT) + 1}`);
