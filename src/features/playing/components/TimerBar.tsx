import { useEffect, useRef } from "react";

interface TimerBarProps {
  duration: number;
  timeClick?: number;
  score: number;
  percent: number;
  startCountDown: boolean;
}

export const TimerBar = ({
  duration,
  timeClick,
  score,
  percent,
  startCountDown,
}: TimerBarProps) => {
  const progressRef = useRef(null);

  // Use CSS animation for smoother progress
  useEffect(() => {
    if (progressRef.current && startCountDown) {
      const element = progressRef.current as HTMLDivElement;
      element.style.transition = "width 50ms linear";
      element.style.width = `${percent}%`;
    } else if (progressRef.current && !startCountDown) {
      // Reset về 100% khi startCountDown = false
      const element = progressRef.current as HTMLDivElement;
      element.style.transition = "none";
      element.style.width = "100%";
    }
  }, [percent, startCountDown]);

  return (
    <div className="w-full relative">
      <div className="relative w-full bg-white/10 rounded-full h-4 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-blue-600 absolute top-0 left-0"
          style={{
            width: `${percent}%`,
          }}
        />

        {timeClick && (
          <div
            className="absolute h-full bg-blue-600/40 left-0 top-0"
            style={{
              width: `${Math.floor((timeClick / duration) * 100)}%`,
            }}
          />
        )}
      </div>
      <span
        className="flex absolute translate-x-2 -top-[9px] justify-center text-white mt-2 text-sm"
        style={{
          left: `${
            !timeClick ? percent : Math.floor((timeClick / duration) * 100)
          }%`,
        }}
      >
        {timeClick
          ? Math.min(Math.floor(400 + (timeClick / duration) * 600), 1000)
          : score}
      </span>
    </div>
  );
};
