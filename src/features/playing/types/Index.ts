export type GamePhase = "WAITING" | "IN_PROGRESS" | "FINISHED";

export type UpdateType = keyof typeof QUESTION_PHASE;

import type { Question as BaseQuestion } from "@/features/createQuiz/type";
import type { Player } from "@/types/Index";
import type { QuestionType } from "../constant";

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
    SHOW_ANSWER_CORRECT: "SHOW_ANSWER_CORRECT",
    SHOW_ANSWER_QUESTION: "SHOW_ANSWER_QUESTION",
    DISPLAY_MEDIA: "DISPLAY_MEDIA",
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
    FILL_BLANK: "FILL_BLANK",
    LAST_QUESTION: "LAST_QUESTION",
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

export interface BaseGameState {
    startAt?: number;
    currentQuestionNumber?: number;
    totalQuestions?: number;
    currentQuestion?: Question;
    countDownDuration: number;
    currentFunfact?: string;
    correctIndexes: number[];
    isCorrectAnswerFillBlank?: boolean;
    totalPlayers: number;
    timeClick?: number;
    correctText?: string;
    remainingTime?: number;
    currentMedia?: string;
}

export interface GameUpdate extends BaseGameState {
    type: UpdateType;
    players: PlayerScore[];
    player: PlayerScore;
    serverTime?: number;
    textPlayerAnswer: string;
    isHost: boolean;
}

export interface submitAnswerProps {
    timeClick: number;
    indexAnswer?: number[];
    textAnswer?: string;
    questionType: QuestionType;
}

export type submitAnswer = ({
    timeClick,
    indexAnswer,
    textAnswer,
}: submitAnswerProps) => void;
