export type GamePhase = "WAITING" | "IN_PROGRESS" | "FINISHED";

export type UpdateType = keyof typeof QUESTION_PHASE;

import type { Question as BaseQuestion } from "@/features/createQuiz/type";
import type { Player } from "@/types/Index";

export interface QuestionPlaying {
  question: Question;
  startTime: number;
  duration: number;
  players: Player[];
}
export const QUESTION_PHASE = {
  START_GAME: "START_GAME",
  PRE_QUESTION: "PRE_QUESTION",
  DISPLAY_QUESTION: "DISPLAY_QUESTION",
  START_COUNTDOWN: "START_COUNTDOWN",
  SHOW_ANSWER: "SHOW_ANSWER",
  DISPLAY_FUNFACT: "DISPLAY_FUNFACT",
  DISPLAY_SCOREBOARD: "DISPLAY_SCOREBOARD",
  GAME_END: "GAME_END",
  PLAYER_JOINED: "PLAYER_JOINED",
  PLAYER_LEFT: "PLAYER_LEFT",
  ANSWER_RESULT: "ANSWER_RESULT",
  NEXT_QUESTION: "NEXT_QUESTION",
  PAUSE_GAME: "PAUSE_GAME",
  RESUME_GAME: "RESUME_GAME",
  SKIP_COUNTDOWN: "SKIP_COUNTDOWN",
  SYNC_TIME: "SYNC_TIME",
  FORCE_NEXT_QUESTION: "FORCE_NEXT_QUESTION",
} as const;

export interface Question extends BaseQuestion {
  funfact?: string;
  correctAnswer?: number;
}

export interface PlayerScore extends Player {
  score: number;
  prevScore: number;
  newPoints?: number;
}

export interface GameUpdate {
  type: UpdateType;
  startAt: number;
  duration?: number;
  questionNumber?: number;
  totalQuestions?: number;
  question?: Question;
  correctAnswer?: number;
  funfact?: string;
  players: PlayerScore[];
  player: PlayerScore;
  playerCount?: number;
  earnedPoints?: number;
  totalScore?: number;
  isCorrect?: boolean;
  correctIndexes: number[];
  totalPlayers?: number;
  serverTime?: number;
  remainingTime?: number;
}

export interface GameState {
  phase: GamePhase;
  currentQuestion?: Question;
  currentQuestionNumber?: number;
  totalQuestions?: number;
  showPreQuestion: boolean;
  playerAnswer: PlayerScore[];
  playerCorrect: PlayerScore[];
  playerCount: number;
  countdownStartTime?: number;
  countdownDuration?: number;
  showingAnswer: boolean;
  showingFunfact: boolean;
  showingScoreboard: boolean;
  showingVote: boolean;
  correctAnswer: number[];
  currentFunfact?: string;
  startAt?: number;
  isPaused: boolean;
  startCountdown: boolean;
  skipCountdown: boolean;
  serverTimeOffset: number;
  remainingTime?: number;
  countdownSpeed: number;
  duration: number;
}
