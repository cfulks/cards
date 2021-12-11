import BlackjackController from "../controllers/BlackjackController.js";
import BlackjackEngine from "../engines/BlackjackEngine.js";

const sockets = (io) => {
  io.on("connection", (socket) => {
    const gameId = socket.handshake.query.id;
    if (!io.sockets.adapter.rooms.get(gameId)) {
      BlackjackEngine.createGame(gameId, io);
    }

    socket.join(gameId);
    BlackjackEngine.getGame(gameId).addPlayer(socket.id, socket);

    socket.on("hit", BlackjackController.hit(gameId, socket.id));
    socket.on("stand", BlackjackController.stand(gameId, socket.id));
    socket.on("bet", BlackjackController.bet(gameId, socket.id));

    socket.on("disconnect", () => {
      BlackjackEngine.getGame(gameId).removePlayer(socket.id);
      if (Object.keys(BlackjackEngine.getGame(gameId).players).length === 0) {
        BlackjackEngine.removeGame(gameId);
      } else {
        BlackjackEngine.getGame(gameId).playerTurn--;
        BlackjackEngine.getGame(gameId).updateGame();
      }
    });
  });

  BlackjackController.io = io;
  BlackjackEngine.build();

  return io;
};

export default sockets;
