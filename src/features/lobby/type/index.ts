import type { Player } from "@/types/Index";

export interface isHostCheck {
  isHost: boolean;
  path: string;
  player: Player;
  idQuiz: string;
}
