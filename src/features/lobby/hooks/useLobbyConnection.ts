import { useEffect } from "react";
import { useLobbyStore } from "../store/lobbyStore";
import { connect, socket } from "@/socket/init.socket";
import type { Room } from "@/types/Index";
import { useNavigate } from "react-router";

export const useSocketConnection = () => {
    const navigate = useNavigate();
    const { setRoom, setPlayers, setIsConnectingWhilePlaying } =
        useLobbyStore();

    useEffect(() => {
        connect();
        const handleRoomUpdate = (updatedRoom: Room) => {
            setPlayers([...updatedRoom.players]);
            setRoom({ ...updatedRoom });
        };

        const handleRoomDestroyed = (data: { message: string }) => {
            alert(data.message);
            navigate("/");
        };
        const handleLeaveRoom = () => {
            navigate("/");
        };

        socket?.on("roomUpdate", handleRoomUpdate);

        socket?.on("roomDestroyed", handleRoomDestroyed);

        socket?.on("leaveRoom", handleLeaveRoom);

        return () => {
            socket?.off("roomUpdate", handleRoomUpdate);
            socket?.off("roomDestroyed", handleRoomDestroyed);
            socket?.off("leaveRoom", handleLeaveRoom);
            setIsConnectingWhilePlaying(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
