import { useState, useEffect, useRef, useCallback } from "react";
import { SCORE } from "../constant";
import type { GameState } from "../store/playingStore";

interface TimerState {
    timeLeft: number;
    timeClick?: number;
    score: number;
    percent: number;
}

export const useQuestionTimer = ({
    startAt,
    countDownDuration,
    isPaused,
    startCountdown,
    skipCountdown,
    remainingTime,
    countdownSpeed,
    getSyncedTime,
}: Pick<
    GameState,
    | "startAt"
    | "countDownDuration"
    | "isPaused"
    | "startCountdown"
    | "skipCountdown"
    | "remainingTime"
    | "countdownSpeed"
> & { getSyncedTime: () => number }) => {
    const [timerState, setTimerState] = useState<TimerState>({
        timeLeft: countDownDuration,
        score: 1000,
        percent: 100,
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const skipStartTimeRef = useRef<number | null>(null); // Thời điểm bắt đầu skip

    const calculateScore = useCallback(
        (timeRemaining: number): number => {
            if (timeRemaining <= 0) return SCORE.MIN;
            if (timeRemaining >= countDownDuration) return SCORE.MAX;

            // Tính điểm số tuyến tính: mỗi millisecond mất đi sẽ giảm điểm
            const scoreRange = SCORE.MAX - SCORE.MIN;
            const timeProgress =
                (countDownDuration - timeRemaining) / countDownDuration;
            const score = SCORE.MAX - scoreRange * timeProgress;

            return Math.max(SCORE.MIN, Math.min(SCORE.MAX, Math.round(score)));
        },
        [countDownDuration]
    );

    const calculatePercent = useCallback(
        (timeRemaining: number): number => {
            if (countDownDuration <= 0) return 0;
            const percent = (timeRemaining / countDownDuration) * 100;
            return Math.max(0, Math.min(100, percent));
        },
        [countDownDuration]
    );
    const calculateRemainingTime = useCallback((): number => {
        if (!startAt || !countDownDuration || !startCountdown) {
            return countDownDuration;
        }

        const syncedNow = getSyncedTime();
        let effectiveRemaining: number;

        if (skipCountdown) {
            if (!skipStartTimeRef.current) {
                // Lần đầu tiên skip, lưu thời điểm bắt đầu skip
                skipStartTimeRef.current = syncedNow;
                effectiveRemaining =
                    remainingTime !== undefined
                        ? remainingTime
                        : Math.max(
                              0,
                              countDownDuration - (syncedNow - startAt)
                          );
            } else {
                // Tính thời gian đã skip với tốc độ tăng tốc
                const skipElapsed = syncedNow - skipStartTimeRef.current;
                const skipElapsedAccelerated = skipElapsed * countdownSpeed;

                // Thời gian còn lại tại thời điểm bắt đầu skip
                const remainingAtSkipStart =
                    remainingTime !== undefined
                        ? remainingTime
                        : Math.max(
                              0,
                              countDownDuration -
                                  (skipStartTimeRef.current - startAt)
                          );

                effectiveRemaining = Math.max(
                    0,
                    remainingAtSkipStart - skipElapsedAccelerated
                );
            }
        } else {
            // Reset skip reference khi không skip
            skipStartTimeRef.current = null;
            const elapsed = Math.max(0, syncedNow - startAt);
            effectiveRemaining =
                remainingTime !== undefined
                    ? remainingTime
                    : Math.max(0, countDownDuration - elapsed);
        }

        return Math.max(0, effectiveRemaining);
    }, [
        startAt,
        countDownDuration,
        startCountdown,
        skipCountdown,
        remainingTime,
        countdownSpeed,
        getSyncedTime,
    ]);

    const calculateTimerState = useCallback((): TimerState => {
        const timeRemaining = calculateRemainingTime();
        const score = calculateScore(timeRemaining);
        const percent = calculatePercent(timeRemaining);

        return {
            timeLeft: timeRemaining,
            score,
            percent,
        };
    }, [calculateRemainingTime, calculateScore, calculatePercent]);

    const resetTimer = useCallback(() => {
        setTimerState({
            timeLeft: countDownDuration,
            score: SCORE.MAX,
            percent: 100,
        });
        skipStartTimeRef.current = null;
    }, [countDownDuration]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        stopTimer();

        intervalRef.current = setInterval(
            () => {
                const newState = calculateTimerState();

                if (newState.timeLeft <= 0) {
                    stopTimer();
                    setTimerState((prev) => ({
                        ...prev,
                        timeLeft: 0,
                        score: SCORE.MIN,
                        percent: 0,
                    }));
                } else {
                    setTimerState((prev) => ({
                        ...prev,
                        ...newState,
                    }));
                }
            },
            skipCountdown ? 16 : 50
        ); // 16ms cho smooth animation khi skip, 50ms cho normal
    }, [calculateTimerState, stopTimer, skipCountdown]);

    // Effect để khởi tạo timer
    useEffect(() => {
        if (!startAt || !startCountdown) {
            resetTimer();
            return;
        }

        const initialState = calculateTimerState();
        setTimerState((prev) => ({
            ...prev,
            ...initialState,
        }));
    }, [startAt, startCountdown, resetTimer, calculateTimerState]);

    // Effect để xử lý pause/unpause và cập nhật liên tục
    useEffect(() => {
        if (!startAt || !startCountdown) return;

        if (isPaused) {
            stopTimer();
            return;
        }

        startTimer();

        return stopTimer;
    }, [
        isPaused,
        startAt,
        startCountdown,
        skipCountdown,
        countdownSpeed,
        startTimer,
        stopTimer,
    ]);

    // Function để ghi lại thời điểm click
    const recordTimeClick = useCallback(
        (setTimeClick: boolean = true): number => {
            const currentState = calculateTimerState();

            setTimerState((prev) => ({
                ...prev,
                score: currentState.score,
                ...(setTimeClick ? { timeClick: currentState.timeLeft } : {}),
            }));

            return currentState.timeLeft;
        },
        [calculateTimerState]
    );

    useEffect(() => {
        return stopTimer;
    }, [stopTimer]);

    return {
        ...timerState,
        recordTimeClick,
    };
};
