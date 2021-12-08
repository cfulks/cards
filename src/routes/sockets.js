import BlackjackController from "../controllers/BlackjackController.js";

const sockets = (io) => {
  io.on("connection", (socket) => {
    const gameId = socket.handshake.query.id;
    if (!io.sockets.adapter.rooms.get(gameId)) {
      // create blackjack instance for id from BlackjackEngine.js
    }

    socket.join(gameId);
    // BlackjackEngine.getGame(gameId).addPlayer(socketId)

    socket.on("hit", BlackjackController.hit(gameId));
    //socket.on("stay", BlackjackController.stay);
    //socket.on("double_down", BlackjackController.doubleDown);

    socket.on("close", () => {
      // remove player from game
      // if game is empty, get rid of it after 1 minute setTimeout(() => {if empty: remove, else: don't}, 60000)
    });
  });

  BlackjackController.io = io;

  return io;
};

export default sockets;
