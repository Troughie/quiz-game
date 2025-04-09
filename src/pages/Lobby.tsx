import { useState, useEffect, useCallback, useMemo } from "react";
import Button from "@/components/ui/ButtonCustom";
import { createRoom, joinRoom } from "@/socket/quizSocket";
import {
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { motion as m } from "framer-motion";

import { ButtonBase } from "@/components/ui/Button";
import type { Player, Room } from "@/types/Index";
import { usePlayerStore } from "@/store/Player";
import { useLocation, useParams } from "react-router";
import { socket } from "@/socket/init.socket";
import { useAnimatedDots } from "@/utils";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW } from "@/constant";
import ModalBase from "@/components/ui/Modal";
import { useUrlChange } from "@/hooks/useUrlChange";

interface LobbyProps {
  isHost: boolean;
  roomId: string;
  players: Player[];
  handleFunction: () => void;
}

const GameControlButton = ({ isHost }: Pick<LobbyProps, "isHost">) => {
  const dots = useAnimatedDots();
  if (isHost) {
    return (
      <Button
        text={`Start Game`}
        classContainer="text-black w-2/3 flex md:px-8 h-10 min-w-[100px] border-3 rounded-3xl"
        classShadow="bg-shadow rounded-3xl"
        classBg="bg-cam rounded-3xl"
      />
    );
  }

  return (
    <Button
      disabled
      classText="cursor-default"
      text={`Waiting for host start ${dots}`}
      classContainer="text-white cursor-default w-2/3 flex md:px-8 h-10 min-w-[100px] border-3 rounded-3xl"
      classShadow="bg-brown-400 rounded-3xl"
      classBg="rounded-3xl bg-black/20"
    />
  );
};

const PlayerList = ({
  players,
  handleFunction,
}: Pick<LobbyProps, "players" | "handleFunction">) => {
  if (!players?.length) {
    return (
      <div className="bg-white/10 rounded-lg p-8 text-center">
        <p className="text-white text-lg">Waiting for players to join...</p>
        <button
          className="text-white cursor-pointer"
          onClick={() => handleFunction()}
        >
          join this room
        </button>
        <p className="text-white/60 mt-2">
          Share the PIN or QR code to invite players
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {players?.map((player) => (
        <m.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={player.id}
          className="bg-white/10 rounded-lg p-4 flex flex-col items-center gap-2"
        >
          <div className="size-16 rounded-full bg-white/20 flex items-center justify-center">
            {player.avatar ? (
              <img
                src={player.avatar}
                alt={player.name}
                className="size-full rounded-full"
              />
            ) : (
              <span className="text-white text-2xl">{player.name[0]}</span>
            )}
          </div>
          <span className="text-white font-medium">{player.name}</span>
        </m.div>
      ))}
    </div>
  );
};

const Setting = () => {
  const { isShow, setIsShow } = useShowFunction();

  return (
    <div className="bg-white/10 rounded-lg p-6 my-4">
      <h3 className="text-white font-medium mb-4">Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white">Sound Effects</span>
          <button
            onClick={() => setIsShow(NAME_SHOW.MUTE, !isShow[NAME_SHOW.MUTE])}
            className="text-white hover:text-gray-300 transition-colors"
          >
            {isShow[NAME_SHOW.MUTE] ? (
              <SpeakerXMarkIcon className="w-6 h-6" />
            ) : (
              <SpeakerWaveIcon className="w-6 h-6" />
            )}
          </button>
        </div>
        {/* Add more settings here */}
      </div>
    </div>
  );
};
const Lobby = () => {
  const [roomId, setRoomId] = useState<string>("");
  const { title } = useParams();
  const { pathname, state } = useLocation();
  const roomIdDir = state?.roomId ?? "";
  const { player } = usePlayerStore();
  const [players, setPlayers] = useState<Player[]>([]);
  const { isShow, setIsShow } = useShowFunction();

  const isHost = useMemo(() => {
    return pathname.includes("play");
  }, [pathname]);
  useUrlChange();

  useEffect(() => {
    (async () => {
      if (!isHost) {
        await joinRoom(roomIdDir, player);
      } else {
        await createRoom(player, title);
      }
    })();
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleRoomUpdate = (updatedRoom: Room) => {
      console.log("Room updated:", updatedRoom);
      setPlayers(updatedRoom.players);
      setRoomId(updatedRoom.id);
    };

    socket?.on("roomUpdate", handleRoomUpdate);

    return () => {
      socket?.off("roomUpdate", handleRoomUpdate);
    };
  }, []);

  const handleCopyPin = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setIsShow(NAME_SHOW.COPY, !isShow[NAME_SHOW.COPY]);
    setTimeout(() => setIsShow(NAME_SHOW.COPY, isShow[NAME_SHOW.COPY]), 2000);
  };

  const handleConnectRoom = () => {
    (async () => {
      await joinRoom(roomId, player);
    })();
  };

  const handleHidden = useCallback(() => {
    if (isShow[NAME_SHOW.HIDDEN_PIN]) {
      return (
        <>
          <EyeIcon className="w-4 h-4" /> show
        </>
      );
    } else {
      return (
        <>
          <EyeSlashIcon className="w-4 h-4" /> hide
        </>
      );
    }
  }, [isShow]);

  return (
    <>
      <ModalBase />
      <div className="min-h-screen bg-petrol flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-black/60 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Game Lobby</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - PIN and QR */}
            <div className="space-y-6">
              <div className="space-y-6 py-2">
                <div className="flex justify-between items-center">
                  <label className="text-white text-sm font-medium">
                    Room PIN
                  </label>
                  <div className="flex">
                    <ButtonBase
                      onClick={handleCopyPin}
                      className="text-white"
                      variant="secondary"
                      size="small"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                      {isShow[NAME_SHOW.COPY] ? "Copied!" : "Copy"}
                    </ButtonBase>
                    <ButtonBase
                      onClick={() =>
                        setIsShow(
                          NAME_SHOW.HIDDEN_PIN,
                          !isShow[NAME_SHOW.HIDDEN_PIN]
                        )
                      }
                      className="text-white"
                      variant="secondary"
                      size="small"
                    >
                      {handleHidden()}
                    </ButtonBase>
                  </div>
                </div>
                <div
                  onClick={handleCopyPin}
                  className="bg-white/10 cursor-pointer text-white text-center text-4xl font-bold p-6 rounded-lg border border-white/20"
                >
                  {isShow[NAME_SHOW.HIDDEN_PIN] ? "••••••" : roomId}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/join/${roomId}`}
                  alt="QR Code"
                  className={`w-full transition-all duration-300 ${
                    isShow[NAME_SHOW.HIDDEN_PIN] ? "blur-sm" : ""
                  }`}
                />
                {isShow[NAME_SHOW.HIDDEN_PIN] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white font-medium">QR Code Hidden</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Player List */}
            <div className="space-y-6">
              <div className="flex justify-center flex-col items-center gap-2">
                <span className="text-white  mb-2">
                  {players.length || 0} players
                </span>
                <button
                  className="text-white cursor-pointer hover:underline"
                  onClick={() => setIsShow(NAME_SHOW.MODAL, true)}
                >
                  Edit character
                </button>
              </div>
              <PlayerList
                players={players}
                handleFunction={handleConnectRoom}
              />
            </div>
          </div>

          {/* Game Controls Section */}
          <div className="mt-8">
            <div className="bg-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
              <h3 className="text-white font-medium mb-4">Game Controls</h3>
              <GameControlButton isHost={isHost} />
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
