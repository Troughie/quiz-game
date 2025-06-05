import { socket } from "@/socket/init.socket";

export const submitAnswer = (indexAnswer: number[], timeClick: number) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      return reject(new Error("Socket not connected"));
    }
    const roomId = sessionStorage.getItem("roomId");
    socket.emit("submit_answer", { roomId, indexAnswer, timeClick });
  });
};

export const pauseGame = () => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      return reject(new Error("Socket not connected"));
    }
    const roomId = sessionStorage.getItem("roomId");

    socket.emit("pauseGame", roomId);

    socket.once("pause_game_error", (err) => {
      reject(err);
    });

    socket.once("update_players", (data) => {
      resolve(data);
    });
  });
};

export const resumeGame = () => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      return reject(new Error("Socket not connected"));
    }
    const roomId = sessionStorage.getItem("roomId");
    socket.emit("resumeGame", roomId);

    socket.once("resumeGameError", (err) => {
      reject(err);
    });

    socket.once("updatePlayers", (data) => {
      resolve(data);
    });
  });
};

export const nextQuestion = () => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      return reject(new Error("Socket not connected"));
    }
    const roomId = sessionStorage.getItem("roomId");
    socket.emit("nextQuestion", roomId);

    socket.once("nextQuestionError", (err) => {
      reject(err);
    });

    socket.once("updatePlayers", (data) => {
      resolve(data);
    });
  });
};
