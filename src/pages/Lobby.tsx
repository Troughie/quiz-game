import { useEffect, useMemo } from "react";

import type { Room } from "@/types/Index";
import { usePlayerStore } from "@/store/Player";
import { connect, socket } from "@/socket/init.socket";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW, REG_PIN } from "@/constant";
import { useUrlChange } from "@/hooks/useUrlChange";
import { GameControlButton } from "@/features/lobby/components/GameControlButton";
import useLobby from "@/features/lobby/hooks/useLobby";
import { PlayerList } from "@/features/lobby/components/PlayerList";
import { Setting } from "@/features/lobby/components/Setting";
import { usePath } from "@/hooks/usePath";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";
import CustomModal from "@/components/ui/Modal";
import ChangePlayer from "@/features/lobby/components/ChangePlayer";
import LeftColumn from "@/features/lobby/components/LeftColumn";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import Playing from "./Playing";
import { usePlaying } from "@/features/playing/hooks/usePlaying";
const Lobby = () => {
  const room = useLobbyStore((state) => state.room);
  const setRoom = useLobbyStore((state) => state.setRoom);
  const players = useLobbyStore((state) => state.players);
  const setPlayers = useLobbyStore((state) => state.setPlayers);
  const { quizCurrent } = useQuizStore();
  const { pathname, path } = usePath();
  const { player } = usePlayerStore();
  const { isBoolean, setIsBoolean } = useShowFunction();
  const { phase, ...playState } = usePlaying();
  const {
    checkingPin,
    createJoinOrReconnect,
    handleConnectRoom,
    handleStartGame,
  } = useLobby();

  connect();
  const isHost = useMemo(() => {
    return pathname.includes("play");
  }, [pathname]);
  useUrlChange();

  useEffect(() => {
    (async () => {
      if (path && quizCurrent) {
        const updateRoom = await createJoinOrReconnect({
          isHost,
          path,
          player,
          idQuiz: quizCurrent?._id,
        });
        if (updateRoom) {
          sessionStorage.setItem("roomId", updateRoom.id);
          setRoom({ ...updateRoom });
          setPlayers([...updateRoom.players]);
        }
      }
    })();
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (path !== "play" && path && REG_PIN.test(path)) {
      checkingPin(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handleRoomUpdate = (updatedRoom: Room) => {
      setPlayers([...updatedRoom.players]);
      setRoom({ ...updatedRoom });
    };

    socket?.on("roomUpdate", handleRoomUpdate);

    return () => {
      socket?.off("roomUpdate", handleRoomUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartGameFunc = () => {
    if (players.length === 0 || !players.find((pl) => pl.id === player.id)) {
      setIsBoolean(NAME_SHOW.CHANGE_PLAYER, true);
    } else {
      if (room) handleStartGame(room.id || "");
    }
  };

  const handleConnectRoomFunc = () => {
    if (!room) {
      console.log("something wrong!!");
      return;
    }
    if (!players.find((pl) => pl.id === player.id))
      handleConnectRoom(room?.id || "", player);
  };

  if (room && phase === "IN_PROGRESS") {
    return <Playing playState={playState} />;
  }

  return (
    <>
      <CustomModal
        isOpen={isBoolean[NAME_SHOW.CHANGE_PLAYER]}
        onOpenChange={() =>
          setIsBoolean(
            NAME_SHOW.CHANGE_PLAYER,
            !isBoolean[NAME_SHOW.CHANGE_PLAYER]
          )
        }
        width="lg"
        maxWidth="3xl"
        confirmText="Submit"
        onConfirm={handleConnectRoomFunc}
        confirmButtonProps={{ variant: "danger" }}
        cancelButtonProps={{ variant: "warning" }}
      >
        <ChangePlayer />
      </CustomModal>
      <div className="min-h-screen bg-petrol flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-black/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Game Lobby</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LeftColumn room={room} />
            {/* Right Column - Player List */}
            <div className="space-y-6">
              <div className="flex justify-center flex-col items-center gap-2">
                <span className="text-white  mb-2">
                  {players.length || 0} players
                </span>
                <button
                  className="text-white cursor-pointer hover:underline"
                  onClick={() => setIsBoolean(NAME_SHOW.CHANGE_PLAYER, true)}
                >
                  Edit character
                </button>
              </div>
              <PlayerList
                players={players}
                handleFunction={() =>
                  setIsBoolean(NAME_SHOW.CHANGE_PLAYER, true)
                }
              />
            </div>
          </div>

          {/* Game Controls Section */}
          <div className="mt-8">
            <div className="bg-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
              <h3 className="text-white font-medium mb-4">Game Controls</h3>

              {room?.id && (
                <GameControlButton
                  isHost={isHost}
                  onClickStart={handleStartGameFunc}
                />
              )}
            </div>
          </div>
          {/* Settings Panel */}
          <Setting />
        </div>
      </div>
    </>
  );
};

export default Lobby;
