import { useState, useEffect, useRef } from "react";

export const useTypewriter = (
    text: string,
    isPaused: boolean = false,
    targetDuration: number, // Thời gian mong muốn hiển thị hết text (ms)
    forceComplete: boolean = false
) => {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const animationIdRef = useRef<number | null>(null);

    // Hàm complete ngay lập tức
    const completeImmediately = () => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }
        setDisplayText(text);
        setIsComplete(true);
    };

    // Hàm animation loop
    const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = currentTime;
        }

        const elapsedTime = currentTime - startTimeRef.current;
        const progress = Math.min(elapsedTime / targetDuration, 1);
        const targetIndex = Math.floor(progress * text.length);

        if (targetIndex <= text.length) {
            setDisplayText(text.substring(0, targetIndex));
        }

        if (progress >= 1) {
            // Animation hoàn thành
            setDisplayText(text);
            setIsComplete(true);
            animationIdRef.current = null;
        } else if (!isPaused && !forceComplete) {
            // Tiếp tục animation
            animationIdRef.current = requestAnimationFrame(animate);
        }
    };

    // Hàm bắt đầu animation
    const startAnimation = () => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
        animationIdRef.current = requestAnimationFrame(animate);
    };

    // Hàm dừng animation
    const stopAnimation = () => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        }
    };

    // Effect để handle forceComplete
    useEffect(() => {
        if (forceComplete && !isComplete) {
            completeImmediately();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forceComplete, isComplete, text]);

    // Handle visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                // Khi quay lại tab, nếu không bị force complete và chưa hoàn thành
                if (
                    !forceComplete &&
                    !isPaused &&
                    !isComplete &&
                    text &&
                    displayText.length < text.length
                ) {
                    startAnimation();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPaused, isComplete, text, displayText, forceComplete]);

    // Effect chính
    useEffect(() => {
        // Cleanup function
        const cleanup = () => {
            stopAnimation();
        };

        if (!text) {
            setDisplayText("");
            setIsComplete(false);
            startTimeRef.current = null;
            cleanup();
            return;
        }

        // Nếu bị force complete
        if (forceComplete && !isComplete) {
            completeImmediately();
            return cleanup;
        }

        // Reset khi text thay đổi
        if (displayText === "" && !isComplete) {
            setDisplayText("");
            setIsComplete(false);
            startTimeRef.current = null;
        }

        // Nếu đang pause, dừng animation
        if (isPaused) {
            stopAnimation();
            return cleanup;
        }

        // Nếu đã hoàn thành
        if (isComplete) {
            return cleanup;
        }

        // Bắt đầu hoặc tiếp tục animation
        if (!animationIdRef.current && displayText.length < text.length) {
            startAnimation();
        }

        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        text,
        targetDuration,
        isPaused,
        displayText,
        isComplete,
        forceComplete,
    ]);

    return { displayText };
};
