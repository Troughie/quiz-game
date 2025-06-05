import type { Player, Room } from "@/types/Index";
import { socket } from "@/socket/init.socket";
// Host methods
export const createRoom = (
  player: Player,
  idQuiz: string | undefined
): Promise<Room> => {
  return new Promise((resolve, reject) => {
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
    if (!socket) return;

    socket.emit("joinRoom", {
      roomId,
      player,
    });

    socket.once("joinSuccess", (room: Room) => {
      resolve(room);
    });

    socket.once("joinError", ({ message }) => {
      console.log(message);

      reject(new Error(message));
    });
  });
};

export const reconnectRoom = async (
  roomId: string,
  player: Player,
  isHost: boolean
): Promise<Room> => {
  return new Promise((resolve, reject) => {
    if (!socket) return;

    socket.emit("reconnect", {
      roomId,
      player,
      isHost,
    });

    socket.once("reconnectSuccess", (room: Room) => {
      resolve(room);
    });

    socket.once("reconnectError", ({ message }) => {
      console.log(message);

      reject(new Error(message));
    });
  });
};

export const startRoom = async (roomId: string) => {
  return new Promise((resolve, reject) => {
    if (!socket) return;
    socket.emit("startGame", roomId);
    socket.once("startSuccess", (room: Room) => {
      resolve(room);
    });

    socket.once("startError", ({ message }) => {
      reject(new Error(message));
    });
  });
};
