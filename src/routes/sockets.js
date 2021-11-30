import BlackjackController from "../controllers/BlackjackController.js";

const sockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("hit", BlackjackController.hit);
    //socket.on("stay", BlackjackController.stay);
    //socket.on("double_down", BlackjackController.doubleDown);
  });

  return io;
};

export default sockets;
