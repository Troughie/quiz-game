import { create } from "zustand";
import type {
    GamePhase,
    GameUpdate,
    PlayerScore,
    BaseGameState,
} from "@/features/playing/types/Index";

export interface GameState extends BaseGameState {
    phase: GamePhase;
    showPreQuestion: boolean;
    playerAnswer: PlayerScore[];
    playerCorrect: PlayerScore[];
    showAnswer: boolean;
    showMedia: boolean;
    showingAnswerCorrect: boolean;
    showingFunfact: boolean;
    showingScoreboard: boolean;
    showingLastQuestion: boolean;
    showingVote: boolean;
    isPaused: boolean;
    startCountdown: boolean;
    skipCountdown: boolean;
    serverTimeOffset: number;
    countdownSpeed: number;
    isCorrectAnswerFillBlank?: boolean;
    textPlayerAnswer: string[];
    isLastQuestion: boolean;
    isHost: boolean;
}

export interface PlayingStore extends GameState {
    handleGameUpdate: (update: GameUpdate) => void;
    resetGame: () => void;
    resetQuestion: () => void;
    getSyncedTime: () => number;
    resetStateFillBlank: () => void;
}

export const usePlayingStore = create<PlayingStore>((set, get) => ({
    // Initial state
    phase: "WAITING",
    correctIndexes: [],
    playerAnswer: [],
    totalPlayers: 0,
    playerCorrect: [],
    showingAnswerCorrect: false,
    showPreQuestion: false,
    showingFunfact: false,
    showingScoreboard: false,
    showingVote: false,
    isPaused: false,
    startCountdown: false,
    skipCountdown: false,
    serverTimeOffset: 0,
    countdownSpeed: 1,
    showAnswer: false,
    showMedia: false,
    textPlayerAnswer: [],
    countDownDuration: 15000,
    isLastQuestion: false,
    showingLastQuestion: false,
    isHost: false,

    handleGameUpdate: (update) => {
        const state = get();
        console.log(update.type);

        switch (update.type) {
            case "START_GAME":
                state.resetGame();
                set({
                    phase: "IN_PROGRESS",
                    totalQuestions: update.totalQuestions,
                    showPreQuestion: true,
                    totalPlayers: update.totalPlayers,
                    isHost: update.isHost,
                });
                break;

            case "PRE_QUESTION":
                set({ showPreQuestion: false });
                break;

            case "DISPLAY_QUESTION":
                if (update.currentQuestion) {
                    set({
                        currentQuestion: update.currentQuestion,
                        currentQuestionNumber: update.currentQuestionNumber,
                        showingAnswerCorrect: false,
                        showingFunfact: false,
                        showingScoreboard: false,
                        showingLastQuestion: false,
                        countDownDuration: update.countDownDuration,
                    });
                }
                break;
            case "SHOW_ANSWER_QUESTION": {
                set({
                    showAnswer: true,
                });
                break;
            }

            case "DISPLAY_MEDIA": {
                set({
                    showMedia: true,
                    currentMedia: update.currentMedia,
                });
                break;
            }

            case "START_COUNTDOWN":
                {
                    const serverTime = update.serverTime || Date.now();
                    const clientTime = Date.now();
                    const offset = serverTime - clientTime;
                    set({
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

            case "LAST_QUESTION":
                set({ isLastQuestion: true, showingLastQuestion: true });
                setTimeout(() => {
                    set({ showingLastQuestion: false });
                }, 3000);
                break;
            case "SHOW_ANSWER_CORRECT":
                set({
                    showingAnswerCorrect: true,
                    showingFunfact: false,
                    showingScoreboard: false,
                    playerCorrect: update.players,
                    correctIndexes: update.correctIndexes,
                    correctText: update.correctText,
                });
                break;

            case "DISPLAY_FUNFACT":
                set({
                    showingFunfact: true,
                    showingScoreboard: false,
                    currentFunfact: update.currentFunfact,
                });
                break;

            case "DISPLAY_SCOREBOARD":
                set({
                    currentQuestion: undefined,
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
                    serverTimeOffset:
                        (update.serverTime || Date.now()) - Date.now(),
                });
                break;
            case "GAME_END":
                set({
                    showingAnswerCorrect: false,
                    showingFunfact: false,
                    phase: "FINISHED",
                });

                break;
            case "ANSWER_RESULT":
                set({
                    textPlayerAnswer: [
                        ...state.textPlayerAnswer,
                        update.textPlayerAnswer,
                    ],
                    ...(update.isCorrectAnswerFillBlank !== undefined && {
                        isCorrectAnswerFillBlank:
                            update.isCorrectAnswerFillBlank,
                    }),
                    ...(update.timeClick !== undefined && {
                        timeClick: update.timeClick,
                    }),
                    ...(update.player !== undefined && {
                        playerAnswer: [...state.playerAnswer, update.player],
                    }),
                });
                break;
            case "NEXT_QUESTION":
                state.resetQuestion();
                break;
            case "PLAYER_JOINED":
            case "PLAYER_LEFT":
                if (typeof update.totalPlayers === "number") {
                    set({ totalPlayers: update.totalPlayers });
                }
                break;
        }
    },
    resetStateFillBlank: () =>
        set((state) => {
            if (state.isCorrectAnswerFillBlank) {
                return {
                    isCorrectAnswerFillBlank: false,
                };
            }
            return {};
        }),
    getSyncedTime: () => {
        const state = get();
        return Date.now() + state.serverTimeOffset;
    },

    resetQuestion: () =>
        set({
            playerAnswer: [],
            playerCorrect: [],
            correctIndexes: [],
            textPlayerAnswer: [],
            showAnswer: false,
            showMedia: false,
            showingAnswerCorrect: false,
            showingFunfact: false,
            showingScoreboard: false,
            showingVote: false,
            isCorrectAnswerFillBlank: undefined,
            remainingTime: undefined,
            startAt: undefined,
            startCountdown: false,
            skipCountdown: false,
            countDownDuration: undefined,
            countdownSpeed: 1,
            currentQuestion: undefined,
            timeClick: undefined,
        }),
    resetGame: () =>
        set({
            phase: "WAITING",
            playerAnswer: [],
            showingVote: false,
            playerCorrect: [],
            textPlayerAnswer: [],
            totalPlayers: 0,
            showingAnswerCorrect: false,
            showingFunfact: false,
            showingScoreboard: false,
            currentQuestion: undefined,
            currentQuestionNumber: undefined,
            totalQuestions: undefined,
            correctIndexes: undefined,
            currentFunfact: undefined,
            countDownDuration: undefined,
            countdownSpeed: 1,
            isLastQuestion: false,
            showAnswer: false,
            showMedia: false,
            showPreQuestion: false,
            isCorrectAnswerFillBlank: false,
            timeClick: undefined,
            showingLastQuestion: false,
        }),
}));
