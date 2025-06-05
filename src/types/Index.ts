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

export interface PlayerWithScore extends Player {
  score: number;
  prevScore: number;
  hasAnswered: number;
  newPoints: number;
}

export interface Room {
  id: string;
  host: Player;
  players: Player[];
  status: "waiting" | "playing" | "finished";
  createdAt: string;
}

export type ResponseBase<T> = {
  success: boolean;
  data: T;
  message: string;
  time: string;
};

export type GamePhase =
  | "WAITING"
  | "START_ANIMATION"
  | "PRE_QUESTION"
  | "QUESTION_DISPLAY"
  | "QUESTION_ANSWERING"
  | "SHOWING_ANSWER"
  | "SHOWING_FUNFACT"
  | "SHOWING_SCOREBOARD"
  | "GAME_ENDED";
