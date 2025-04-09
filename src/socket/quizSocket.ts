import type { Player, Room } from "@/types/Index";
import { connect, socket } from "./init.socket";

// interface QuizRoom {
//   pin: string;
//   players: Player[];
//   settings: {
//     timePerQuestion: number;
//     numberOfQuestions: number;
//     gameMode: "classic" | "team" | "battle";
//     randomizeQuestions: boolean;
//     showCorrectAnswers: boolean;
//   };
//   status: "waiting" | "playing" | "finished";
// }

// Host methods
export const createRoom = (
  player: Player,
  idQuiz: string | undefined
): Promise<Room> => {
  return new Promise((resolve, reject) => {
    connect();
    if (!socket) {
      return reject(new Error("Socket not connected"));
    }

    socket.emit("createRoom", { player, idQuiz });

    socket.once("createRoomSuccess", (room: Room) => {
      resolve(room);
    });

    // Optional: thêm timeout hoặc xử lý lỗi nếu cần
    socket.once("connect_error", (err) => {
      reject(err);
    });
  });
};

export const getRoom = async (roomId: string): Promise<Room> => {
  return new Promise((resolve, reject) => {
    socket?.emit("getRoom", roomId);

    socket?.once("getRoomSuccess", (room: Room) => {
      resolve(room);
    });

    socket?.once("getRoomError", ({ message }) => {
      reject(message);
    });
  });
};

// Player methods
export const joinRoom = async (
  roomId: string,
  player: Player
): Promise<Room> => {
  return new Promise((resolve, reject) => {
    connect();
    if (!socket) return;

    socket.emit("joinRoom", {
      roomId,
      player,
    });

    socket.once("joinSuccess", (room: Room) => {
      resolve(room);
    });

    socket.once("joinError", ({ message }) => {
      reject(new Error(message));
    });
  });
};
