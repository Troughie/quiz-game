import { useState, useEffect, useRef } from "react";

export const useTypewriter = (
  text: string,
  isPaused: boolean = false,
  targetDuration: number // Thời gian mong muốn hiển thị hết text (ms)
) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tính toán tốc độ tự động dựa trên độ dài text và thời gian mong muốn
  const calculateSpeed = (textLength: number, targetDuration: number) => {
    // Tính tốc độ để hiển thị hết text trong thời gian mong muốn
    const calculatedSpeed = targetDuration / textLength;
    // Đảm bảo tốc độ không quá nhanh (tối thiểu 10ms) hoặc quá chậm (tối đa 500ms)
    return Math.max(10, Math.min(500, calculatedSpeed));
  };

  // Hàm khởi động typewriter
  const startTypeWriter = (speed: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const textLength = text?.length || 0;

      if (currentIndexRef.current < textLength) {
        currentIndexRef.current++;
        setDisplayText(text!.substring(0, currentIndexRef.current));

        // Kiểm tra xem đã hiển thị hết chưa sau khi tăng index
        if (currentIndexRef.current >= textLength) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsComplete(true);
        }
      }
    }, speed);
  };
  // Hàm dừng typewriter
  const stopTypeWriter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Cleanup function để dọn dẹp interval
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!text) {
      setDisplayText("");
      setIsComplete(false);
      currentIndexRef.current = 0;
      cleanup();
      return;
    }

    // Khi text thay đổi, reset tất cả
    if (currentIndexRef.current === 0 && displayText === "") {
      console.log("New text detected, resetting...");
      currentIndexRef.current = 0;
      setDisplayText("");
      setIsComplete(false);
    }

    // Nếu đang pause, dừng interval nhưng không reset gì cả
    if (isPaused) {
      console.log("Paused - stopping typewriter");
      stopTypeWriter();
      return cleanup;
    }

    // Nếu đã hoàn thành, không làm gì cả
    if (isComplete) {
      console.log("Already complete - no action taken");
      return cleanup;
    }

    // Nếu chưa bắt đầu hoặc đang tiếp tục từ pause
    if (currentIndexRef.current < text.length) {
      const actualSpeed = calculateSpeed(text.length, targetDuration);
      startTypeWriter(actualSpeed);
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, targetDuration, isPaused, isComplete, displayText]);

  return { isComplete, displayText };
};
