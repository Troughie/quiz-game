import { Outlet } from "react-router-dom";
import { useSocketConnection } from "@/features/lobby/hooks/useLobbyConnection";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { useAnimatedDots } from "@/utils";
import { useGameInitialization } from "../hooks/useGameInitialization";
import type { LobbyLayoutContext } from "../type";
import { useEffect } from "react";

const LobbyLayout: React.FC = () => {
    const room = useLobbyStore((state) => state.room);
    const isConnectingWhilePlaying = useLobbyStore(
        (state) => state.isConnectingWhilePlaying
    );
    const dots = useAnimatedDots();

    // Socket connection được maintain ở level này
    useSocketConnection();
    useEffect(() => {
        console.log(room);
    }, [room]);

    const { isHost } = useGameInitialization({ room });

    // Loading state khi chưa có room
    if (!room) {
        return (
            <div className="fixed bg-black/30 inset-0 flex items-center justify-center text-center">
                <span className="text-3xl text-white">
                    Connecting server {dots}
                </span>
            </div>
        );
    }

    // Loading state khi đang connecting while playing
    if (isConnectingWhilePlaying) {
        return (
            <div className="fixed bg-black/30 inset-0 flex items-center justify-center text-center">
                <span className="text-3xl text-white">
                    Waiting for next question....
                </span>
            </div>
        );
    }

    const outletContext: LobbyLayoutContext = {
        room,
        isHost,
    };

    return <Outlet context={outletContext} />;
};

export default LobbyLayout;
