import { useEffect } from "react";
import { usePlayingStore } from "../store/playingStore";
import { socket } from "@/socket/init.socket";
import {
  submitAnswer,
  pauseGame,
  resumeGame,
  nextQuestion,
} from "../service/playingSocket";

export const usePlaying = () => {
  const { handleGameUpdate, ...state } = usePlayingStore();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("room_update", handleGameUpdate);

    return () => {
      if (socket) {
        socket.off("room_update", handleGameUpdate);
      }
    };
  }, [handleGameUpdate]);

  const submitAnswerSocket = (indexAnswer: number[], timeClick: number) => {
    submitAnswer(indexAnswer, timeClick);
  };

  return {
    ...state,
    submitAnswer: submitAnswerSocket,
    pauseGame,
    resumeGame,
    nextQuestion,
  };
};
