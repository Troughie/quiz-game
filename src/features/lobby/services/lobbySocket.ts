import type { Player, Room } from "@/types/Index";
import { socket } from "@/socket/init.socket";
import { LeaveRoomAction } from "../type";
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
        socket.once("createRoomError", (err) => {
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
    player: Player,
    roomId: string,
    idQuiz: string,
    setIsConnectingWhilePlaying: (value: boolean) => void
): Promise<Room> => {
    return new Promise((resolve) => {
        if (!socket) return;

        let countTimeConnect = 0;
        const attemptReconnect = () => {
            if (countTimeConnect >= 20) {
                console.warn("Timeout!!!");
                return;
            }
            socket?.emit("reconnect", {
                player,
                roomId,
                idQuiz,
            });
        };

        socket.once("reconnectSuccess", (room: Room) => {
            setIsConnectingWhilePlaying(false);
            resolve(room);
        });

        socket.on("reconnectError", ({ message, shouldRedirectHome }) => {
            setIsConnectingWhilePlaying(true);

            console.log(message);
            if (shouldRedirectHome) {
                return window.location.replace("/");
            }

            // Retry after delay
            setTimeout(() => {
                countTimeConnect++;
                attemptReconnect();
            }, 2000);
        });

        // Start first attempt
        attemptReconnect();
    });
};

export const startRoom = async (roomId: string, quizId: string) => {
    return new Promise((resolve, reject) => {
        if (!socket) return;

        socket.emit("startGame", { roomId, quizId });
        socket.once("startSuccess", (room: Room) => {
            resolve(room);
        });

        socket.once("startError", ({ message }) => {
            reject(new Error(message));
        });
    });
};

export const leaveRoom = async (roomId: string, action: LeaveRoomAction) => {
    return new Promise((resolve, reject) => {
        if (!socket) return;
        const eventName =
            action === LeaveRoomAction.KEEP
                ? "hostLeaveRoomKeep"
                : "hostLeaveRoom";
        socket.emit(eventName, roomId);
        socket.once("leaveSuccess", (room: Room) => {
            resolve(room);
        });

        socket.once("leaveError", ({ message }) => {
            reject(new Error(message));
        });
    });
};

export const updatedPlayerInfo = async (player: Partial<Player>) => {
    return new Promise((resolve, reject) => {
        if (!socket) return;

        socket.emit("updatePlayer", player);
        socket.once("updatePlayerSuccess", (room: Room) => {
            resolve(room);
        });

        socket.once("updatePlayerError", ({ message }) => {
            reject(new Error(message));
        });
    });
};
