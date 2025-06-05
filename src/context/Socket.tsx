import React, { createContext, useContext, useEffect } from "react";
import { connect, disconnect, socket } from "@/socket/init.socket";

const SocketContext = createContext<typeof socket | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    connect();
    return () => {
      disconnect(); // hoặc socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
