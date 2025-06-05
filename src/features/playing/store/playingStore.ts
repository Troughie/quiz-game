import { create } from "zustand";
import type {
  GamePhase,
  GameUpdate,
  Question,
  PlayerScore,
} from "@/features/playing/types/Index";

interface GameState {
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
}

export interface PlayingStore extends GameState {
  handleGameUpdate: (update: GameUpdate) => void;
  resetGame: () => void;
  resetQuestion: () => void;
  getSyncedTime: () => number;
  setScore: (player: PlayerScore) => void;
}

export const usePlayingStore = create<PlayingStore>((set, get) => ({
  // Initial state
  phase: "WAITING",
  correctAnswer: [],
  playerAnswer: [],
  playerCount: 0,
  playerCorrect: [],
  showingAnswer: false,
  showPreQuestion: false,
  showingFunfact: false,
  showingScoreboard: false,
  showingVote: false,
  isPaused: false,
  startCountdown: false,
  skipCountdown: false,
  serverTimeOffset: 0,
  countdownSpeed: 1,

  handleGameUpdate: (update) => {
    const state = get();
    console.log(update.type);

    switch (update.type) {
      case "START_GAME":
        set({
          phase: "IN_PROGRESS",
          totalQuestions: update.totalQuestions,
          showPreQuestion: true,
          playerCount: update.totalPlayers,
        });
        break;

      case "PRE_QUESTION":
        set({ showPreQuestion: false });
        break;

      case "FORCE_NEXT_QUESTION":
        break;

      case "DISPLAY_QUESTION":
        if (update.question) {
          set({
            currentQuestion: update.question,
            currentQuestionNumber: update.questionNumber,
            showingAnswer: false,
            showingFunfact: false,
            showingScoreboard: false,
          });
        }
        break;
      case "SYNC_TIME": {
        const syncServerTime = update.serverTime || Date.now();
        const syncClientTime = Date.now();
        const newOffset = syncServerTime - syncClientTime;

        // Smooth the offset to avoid jumps
        const smoothedOffset = state.serverTimeOffset * 0.7 + newOffset * 0.3;

        set({
          serverTimeOffset: smoothedOffset,
          remainingTime: update.remainingTime,
        });
        break;
      }

      case "START_COUNTDOWN":
        {
          const serverTime = update.serverTime || Date.now();
          const clientTime = Date.now();
          const offset = serverTime - clientTime;
          set({
            countdownDuration: update.duration,
            serverTimeOffset: offset,
            startAt: update.startAt,
            startCountdown: true,
            skipCountdown: false,
          });
        }
        break;
      case "SKIP_COUNTDOWN":
        set({
          skipCountdown: true,
          countdownSpeed: 10,
        });
        break;

      case "SHOW_ANSWER":
        set({
          showingAnswer: true,
          showingFunfact: false,
          showingScoreboard: false,
          correctAnswer: update.correctIndexes,
          playerCorrect: update.players,
        });
        break;

      case "DISPLAY_FUNFACT":
        set({
          showingFunfact: true,
          showingScoreboard: false,
          currentFunfact: update.funfact,
        });
        break;

      case "DISPLAY_SCOREBOARD":
        set({
          showingFunfact: false,
          showingScoreboard: true,
          playerAnswer: update.players || [],
        });
        break;
      case "PAUSE_GAME":
        set({
          isPaused: true,
        });
        break;
      case "RESUME_GAME":
        set({
          isPaused: false,
          startAt: update.startAt,
          serverTimeOffset: (update.serverTime || Date.now()) - Date.now(),
        });
        break;
      case "GAME_END":
        set({
          showingVote: true,
          showingAnswer: false,
          showingFunfact: false,
          showingScoreboard: false,
        });
        break;
      case "ANSWER_RESULT":
        set({
          playerAnswer: [...state.playerAnswer, update.player],
        });
        break;
      case "NEXT_QUESTION":
        state.resetQuestion();
        break;
      case "PLAYER_JOINED":
      case "PLAYER_LEFT":
        if (typeof update.playerCount === "number") {
          set({ playerCount: update.playerCount });
        }
        break;
    }
  },
  getSyncedTime: () => {
    const state = get();
    return Date.now() + state.serverTimeOffset;
  },

  setScore: (player: PlayerScore) =>
    set((state) => {
      return {
        playerAnswer: [...state.playerAnswer, player],
      };
    }),
  resetQuestion: () =>
    set({
      playerAnswer: [],
      playerCount: 0,
      startAt: undefined,
      showingAnswer: false,
      showingFunfact: false,
      showingScoreboard: false,
      currentQuestion: undefined,
      currentQuestionNumber: undefined,
      correctAnswer: undefined,
      currentFunfact: undefined,
      countdownStartTime: undefined,
      countdownDuration: undefined,
      countdownSpeed: 1,
      startCountdown: false,
    }),
  resetGame: () =>
    set({
      phase: "WAITING",
      playerAnswer: [],
      showingVote: false,
      playerCorrect: [],
      playerCount: 0,
      showingAnswer: false,
      showingFunfact: false,
      showingScoreboard: false,
      currentQuestion: undefined,
      currentQuestionNumber: undefined,
      totalQuestions: undefined,
      correctAnswer: undefined,
      currentFunfact: undefined,
      countdownStartTime: undefined,
      countdownDuration: undefined,
      countdownSpeed: 1,
    }),
}));
