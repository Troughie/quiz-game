import type { Player, Room } from "@/types/Index";
import { create } from "zustand";

interface LobbyProps {
  players: Player[];
  room?: Partial<Room> | Room;
  setRoom: (newRoom: Partial<Room>) => void;
  setPlayers: (players: Player[]) => void;
}

export const useLobbyStore = create<LobbyProps>()((set) => ({
  room: undefined,
  players: [],
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
}));
