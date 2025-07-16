import { socket } from "@/socket/init.socket";
import type { submitAnswerProps } from "../types/Index";

export const submitAnswer = ({
    timeClick,
    indexAnswer,
    textAnswer,
    questionType,
}: submitAnswerProps) => {
    return new Promise((resolve, reject) => {
        if (!socket) {
            return reject(new Error("Socket not connected"));
        }
        const roomId = sessionStorage.getItem("roomId");
        socket.emit("submit_answer", {
            roomId,
            selectedIndexes: indexAnswer,
            text: textAnswer,
            timeClick,
            questionType,
        });
    });
};

export const pauseGame = () => {
    return new Promise((resolve, reject) => {
        if (!socket) {
            return reject(new Error("Socket not connected"));
        }
        const roomId = sessionStorage.getItem("roomId");

        socket.emit("pauseGame", roomId);

        socket.once("pause_game_error", (err) => {
            reject(err);
        });

        socket.once("updatePlayers", (data) => {
            resolve(data);
        });
    });
};

export const resumeGame = () => {
    return new Promise((resolve, reject) => {
        if (!socket) {
            return reject(new Error("Socket not connected"));
        }
        const roomId = sessionStorage.getItem("roomId");
        socket.emit("resumeGame", roomId);

        socket.once("resumeGameError", (err) => {
            reject(err);
        });

        socket.once("updatePlayers", (data) => {
            resolve(data);
        });
    });
};

export const nextQuestion = () => {
    return new Promise((resolve, reject) => {
        if (!socket) {
            return reject(new Error("Socket not connected"));
        }
        const roomId = sessionStorage.getItem("roomId");
        socket.emit("nextQuestion", roomId);

        socket.once("nextQuestionError", (err) => {
            reject(err);
        });

        socket.once("updatePlayers", (data) => {
            resolve(data);
        });
    });
};

export const doneQuiz = () => {
    return new Promise((resolve, reject) => {
        if (!socket) {
            return reject(new Error("Socket not connected"));
        }
        const roomId = sessionStorage.getItem("roomId");
        socket.emit("doneGame", roomId);

        socket.once("doneGameError", (err) => {
            reject(err);
        });

        socket.once("updatePlayers", (data) => {
            resolve(data);
        });
    });
};
