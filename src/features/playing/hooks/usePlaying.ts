import { useEffect } from "react";
import { usePlayingStore } from "../store/playingStore";
import { socket } from "@/socket/init.socket";
import {
    submitAnswer,
    pauseGame,
    resumeGame,
    nextQuestion,
    doneQuiz,
} from "../service/playingSocket";
import type { submitAnswerProps } from "../types/Index";

export const usePlaying = () => {
    const { handleGameUpdate, ...state } = usePlayingStore();

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("room_update_while_playing", handleGameUpdate);

        return () => {
            if (socket) {
                socket.off("room_update_while_playing", handleGameUpdate);
            }
        };
    }, [handleGameUpdate]);

    const submitAnswerSocket = ({
        timeClick,
        indexAnswer,
        textAnswer,
        questionType,
    }: submitAnswerProps) => {
        submitAnswer({ timeClick, indexAnswer, textAnswer, questionType });
    };

    return {
        ...state,
        submitAnswer: submitAnswerSocket,
        pauseGame,
        resumeGame,
        nextQuestion,
        doneQuiz,
    };
};
