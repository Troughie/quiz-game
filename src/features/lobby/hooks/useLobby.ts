import useRequest from "@/hooks/useMutation";
import { post } from "@/libs/init.axios";
import type { Player } from "@/types/Index";
import { useNavigate } from "react-router";
import type { isHostCheck, LeaveRoomAction } from "../type";
import {
    createRoom,
    joinRoom,
    startRoom,
    reconnectRoom,
    leaveRoom,
} from "../services/lobbySocket";
import { useLobbyStore } from "../store/lobbyStore";
import { usePath } from "@/hooks/usePath";

const useLobby = () => {
    const { setIsConnectingWhilePlaying } = useLobbyStore();
    const { path } = usePath();
    const navigate = useNavigate();

    const { mutate: checkingPin } = useRequest({
        mutationFn: (pin: string) => {
            return post({ url: "lobby/submit-pin", data: { pin } });
        },
        onError: (error) => {
            navigate("404", { replace: true });
            console.error("Error checking pin:", error);
        },
        showSwal: false,
    });

    const createJoinOrReconnect = async ({ isHost, player }: isHostCheck) => {
        if (!path) return;

        const result = await reconnectRoom(
            player,
            path,
            path,
            setIsConnectingWhilePlaying
        );
        if (result) {
            return result;
        }

        if (!isHost) {
            if (path) return await joinRoom(path, player);
        } else {
            return await createRoom(player, path);
        }
    };

    const handleConnectRoom = (roomId: string, player: Player) => {
        (async () => {
            await joinRoom(roomId, player);
        })();
    };

    const handleStartGame = (roomId: string) => {
        (async () => {
            await startRoom(roomId, path || "");
        })();
    };

    const handleLeaveRoom = (roomId: string, action: LeaveRoomAction) => {
        (async () => {
            await leaveRoom(roomId, action);
        })();
    };

    return {
        checkingPin,
        createJoinOrReconnect,
        handleConnectRoom,
        handleStartGame,
        handleLeaveRoom,
    };
};

export default useLobby;
