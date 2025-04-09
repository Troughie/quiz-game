export const enum typeAlert {
  success = "success",
  error = "error",
  info = "info",
  warning = "warning",
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
}

export interface Room {
  id: string;
  host: Player;
  players: Player[];
  status: "waiting" | "playing" | "finished";
  createdAt: string;
}
