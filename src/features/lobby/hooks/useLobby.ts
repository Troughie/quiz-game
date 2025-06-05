import useRequest from "@/hooks/useMutation";
import { post } from "@/libs/init.axios";
import type { Player } from "@/types/Index";
import { splitPin } from "@/utils";
import { useNavigate } from "react-router";
import type { isHostCheck } from "../type";
import {
  createRoom,
  joinRoom,
  startRoom,
  reconnectRoom,
} from "../services/lobbySocket";

const useLobby = () => {
  const navigate = useNavigate();

  const { mutate: checkingPin } = useRequest({
    mutationFn: (pin: string) => {
      const lastPin = splitPin(pin);
      return post({ url: "lobby/submit-pin", data: { pin: lastPin } });
    },
    onError: (error) => {
      navigate("404", { replace: true });
      console.error("Error checking pin:", error);
    },
    showSwal: false,
  });

  const createJoinOrReconnect = async ({
    isHost,
    path,
    player,
    idQuiz,
  }: isHostCheck) => {
    const roomId = sessionStorage.getItem("roomId");

    if (roomId) {
      const result = await reconnectRoom(roomId, player, isHost);
      return result;
    }

    if (!isHost) {
      if (path) return await joinRoom(splitPin(path), player);
    } else {
      return await createRoom(player, idQuiz);
    }
  };

  const handleConnectRoom = (roomId: string, player: Player) => {
    (async () => {
      await joinRoom(roomId, player);
    })();
  };

  const handleStartGame = (roomId: string) => {
    (async () => {
      await startRoom(roomId);
    })();
  };

  return {
    checkingPin,
    createJoinOrReconnect,
    handleConnectRoom,
    handleStartGame,
  };
};

export default useLobby;
