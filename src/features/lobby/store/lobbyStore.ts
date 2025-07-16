import type { Player, Room } from "@/types/Index";
import { create } from "zustand";

interface LobbyProps {
    players: Player[];
    room?: Partial<Room> | Room;
    isConnectingWhilePlaying: boolean;
    setRoom: (newRoom: Partial<Room>) => void;
    setPlayers: (players: Player[]) => void;
    setIsConnectingWhilePlaying: (value: boolean) => void;
}

export const useLobbyStore = create<LobbyProps>()((set) => ({
    room: undefined,
    players: [],
    isConnectingWhilePlaying: false,
    setRoom: (newRoom: Partial<Room>) =>
        set((state) => {
            return {
                room: {
                    ...(state.room as Partial<Room>),
                    ...newRoom,
                },
            };
        }),
    setPlayers: (players: Player[]) => set({ players }),
    setIsConnectingWhilePlaying: (value: boolean) =>
        set({ isConnectingWhilePlaying: value }),
}));
