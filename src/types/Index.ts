import type { QUESTION_PHASE } from "@/features/playing/types/Index";

export const enum typeAlert {
    success = "success",
    error = "error",
    info = "info",
    warning = "warning",
}

export enum STATUS_ROOM {
    WAITING = "WAITING",
    STARTED = "STARTED",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    ENDED = "ENDED",
    SELECTING_MODE = "SELECTING_MODE",
}

export interface Player {
    _id: string;
    id: string;
    username: string;
    avatar?: string;
}

export interface PlayerWithScore extends Player {
    score: number;
    prevScore: number;
    hasAnswered: number;
    newPoints: number;
}

export interface Room {
    phase: keyof typeof QUESTION_PHASE;
    id: string;
    host: Player;
    players: Player[];
    status: keyof typeof STATUS_ROOM;
    createdAt: string;
    disconnect: boolean;
}

export type ResponseBase<T> = {
    success: boolean;
    data: T;
    message: string;
    time: string;
};

export interface ItemsTypeProps {
    link: string;
    img: string;
    title: string;
    description: string;
}
