import type { Quiz } from "@/features/createQuiz/type";
import React, { useState } from "react";

type VoteProps = {
  quiz: Quiz; // Replace 'any' with your quiz type if available
  initialValue?: number;
  onChange?: (value: number) => void;
};

const MAX_STARS = 5;

const Star: React.FC<{
  filled: boolean;
  half: boolean;
  onClick: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}> = ({ filled, half, onClick, onMouseMove, onMouseLeave }) => (
  <span
    style={{
      cursor: "pointer",
      fontSize: 32,
      color: filled || half ? "#FFD700" : "#ccc",
      position: "relative",
    }}
    onClick={onClick}
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseLeave}
  >
    {half ? (
      <span style={{ position: "absolute", width: "50%", overflow: "hidden" }}>
        ★
      </span>
    ) : (
      "★"
    )}
  </span>
);

export const Vote: React.FC<VoteProps> = ({
  quiz,
  initialValue = 0,
  onChange,
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (starIndex: number, isHalf: boolean) => {
    const newValue = isHalf ? starIndex + 0.5 : starIndex + 1;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleMouseMove = (starIndex: number, e: React.MouseEvent) => {
    const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - left;
    setHoverValue(x < width / 2 ? starIndex + 0.5 : starIndex + 1);
  };

  const handleMouseLeave = () => setHoverValue(null);

  const displayValue = hoverValue !== null ? hoverValue : value;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 rounded-xl p-8 shadow-lg max-w-2xl w-full mx-4 space-y-6">
        {/* Quiz info */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">{quiz.name}</h2>
          {quiz.media && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={quiz.media}
                alt={quiz.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Rating section */}
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            {[...Array(MAX_STARS)].map((_, i) => {
              const filled = displayValue >= i + 1;
              const half = !filled && displayValue >= i + 0.5;
              return (
                <span key={i} style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      width: "50%",
                      height: "100%",
                      left: 0,
                      top: 0,
                      overflow: "hidden",
                      pointerEvents: "auto",
                    }}
                    onClick={() => handleClick(i, true)}
                    onMouseMove={(e) => handleMouseMove(i, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Star
                      filled={false}
                      half={half}
                      onClick={() => handleClick(i, true)}
                      onMouseMove={(e) => handleMouseMove(i, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      left: 0,
                      top: 0,
                      pointerEvents: "auto",
                    }}
                    onClick={() => handleClick(i, false)}
                    onMouseMove={(e) => handleMouseMove(i, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Star
                      filled={filled}
                      half={false}
                      onClick={() => handleClick(i, false)}
                      onMouseMove={(e) => handleMouseMove(i, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  </span>
                  <span style={{ visibility: "hidden" }}>★</span>
                </span>
              );
            })}
          </div>
          <div className="text-center text-white text-lg">
            Your rating: {value} / {MAX_STARS}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
