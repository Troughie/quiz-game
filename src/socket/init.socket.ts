import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let isConnected = false;
const connect = () => {
  if (isConnected) return;

  socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });

  setupListeners();
  isConnected = true;
};

const setupListeners = () => {
  if (!socket) return;

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
    isConnected = false;
  });
};

// Cleanup
export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

export { connect, setupListeners, socket };
