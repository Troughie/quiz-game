import type { Player } from "@/types/Index";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerStore {
  player: Player;
  createPlayer: (player: Player) => void;
  updatePlayer: (player: Partial<Player>) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      player: { id: "", name: "", avatar: "a" },
      createPlayer: (player) => set({ player }),
      updatePlayer: (updatedPlayer) =>
        set((state) => ({
          player: { ...state.player, ...updatedPlayer },
        })),
    }),
    {
      name: "player-storage", // name of the item in the storage (must be unique)
    }
  )
);
