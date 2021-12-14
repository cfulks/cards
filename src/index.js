import express from "express";
import { Server } from "socket.io";
import routes from "./routes/routes.js";
import sockets from "./routes/sockets.js";

const app = routes(express());
const io = sockets(
  new Server({
    cors: {
      // Fixing CORS since the servers are on different ports
      origin: "*",
    },
  })
);

app.listen(process.env.PORT);
io.listen(`${parseInt(process.env.PORT) + 1}`); // socket.io server is one port higher than the express server.
