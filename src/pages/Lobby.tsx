import { usePlayerStore } from "@/store/Player";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW } from "@/constant";
import { GameControlButton } from "@/features/lobby/components/GameControlButton";
import useLobby from "@/features/lobby/hooks/useLobby";
import { PlayerList } from "@/features/lobby/components/PlayerList";
import { Setting } from "@/features/lobby/components/Setting";
import CustomModal from "@/components/ui/Modal";
import ChangePlayer from "@/features/lobby/components/ChangePlayer";
import LeftColumn from "@/features/lobby/components/LeftColumn";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { useCallback, useMemo } from "react";
import { usePreventNavigation } from "@/hooks/useUrlChange";
import LeaveOrKeepRoom from "@/features/lobby/components/LeaveOrKeepRoom";
import { LeaveRoomAction } from "@/features/lobby/type";
import { useLobbyLayoutContext } from "@/features/lobby/hooks/useLobbyLayoutContext";
import { usePlaying } from "@/features/playing/hooks/usePlaying";
import Playing from "./Playing";
import QuizSelectionModal from "@/features/playing/components/SelectingMode";

const Lobby = () => {
    const players = useLobbyStore((state) => state.players);
    const { ...playState } = usePlaying();
    const { room, isHost } = useLobbyLayoutContext();
    const { player } = usePlayerStore();
    const { isBoolean, setIsBoolean } = useShowFunction();
    const { handleConnectRoom, handleStartGame, handleLeaveRoom } = useLobby();

    //block user prevent navigation if player  in room more than 2
    usePreventNavigation(isHost && players.length >= 1);

    const playerCount = useMemo(() => players.length || 0, [players.length]);

    const isPlayerInRoom = useMemo(
        () => players.some((p) => p.id === player.id),
        [players, player.id]
    );

    const handleStartGameFunc = useCallback(() => {
        setIsBoolean(NAME_SHOW.START_GAME, true);

        if (players.length === 0 || !isPlayerInRoom) {
            setIsBoolean(NAME_SHOW.CHANGE_PLAYER, true);
        } else {
            if (room) handleStartGame(room.id || "");
        }
    }, [handleStartGame, isPlayerInRoom, players.length, room, setIsBoolean]);

    const handleConnectRoomFunc = () => {
        if (!room) {
            console.log("something wrong!!");
            return;
        }
        if (!isPlayerInRoom) handleConnectRoom(room?.id || "", player);
    };

    const handleLeaveRoomAction = (status: LeaveRoomAction) => {
        if (room?.id) {
            handleLeaveRoom(room.id, status);
            setIsBoolean(NAME_SHOW.MODAL, false);
        }
    };

    if (room && room.status === "PLAYING") {
        return <Playing playState={playState} />;
    }

    if (room && room.status === "SELECTING_MODE") {
        return <QuizSelectionModal />;
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
            <CustomModal
                isOpen={isBoolean[NAME_SHOW.MODAL]}
                onOpenChange={() =>
                    setIsBoolean(NAME_SHOW.MODAL, !isBoolean[NAME_SHOW.MODAL])
                }
                width="lg"
                maxWidth="3xl"
                confirmText="Submit"
                showBtn={false}
            >
                <LeaveOrKeepRoom
                    cancelAction={() =>
                        setIsBoolean(
                            NAME_SHOW.MODAL,
                            !isBoolean[NAME_SHOW.MODAL]
                        )
                    }
                    leaveRoomAction={handleLeaveRoomAction}
                />
            </CustomModal>
            <div className="min-h-screen bg-petrol flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-black/60 rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-white">
                            Game Lobby
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <LeftColumn room={room} />
                        {/* Right Column - Player List */}
                        <div className="space-y-6">
                            <div className="flex justify-center flex-col items-center gap-2">
                                <span className="text-white  mb-2">
                                    {playerCount} players
                                </span>
                                <button
                                    className="text-white cursor-pointer hover:underline"
                                    onClick={() =>
                                        setIsBoolean(
                                            NAME_SHOW.CHANGE_PLAYER,
                                            true
                                        )
                                    }
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
                            <h3 className="text-white font-medium mb-4">
                                Game Controls
                            </h3>

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
