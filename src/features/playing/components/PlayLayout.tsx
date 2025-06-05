import React from "react";
import { motion } from "framer-motion";
import { PauseIcon, PlayIcon, ForwardIcon } from "@heroicons/react/24/solid";
import type { Quiz } from "@/features/createQuiz/type";

interface PlayLayoutProps {
  children: React.ReactNode;
  quiz: Quiz;
  answeredCount: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  isPaused: boolean;
  totalPlayers: number;
  onPauseToggle: () => void;
  onNext: () => void;
}

const PlayLayout = ({
  children,
  quiz,
  answeredCount,
  currentQuestionIndex,
  totalQuestions,
  isPaused,
  onPauseToggle,
  onNext,
  totalPlayers = 0,
}: PlayLayoutProps) => {
  return (
    <div className="min-h-screen bg-petrol flex flex-col">
      {/* Header */}
      <header className="p-4 z-20 bg-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-white text-xl font-bold">{quiz.name}</h1>
            <div className="text-white">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Players answered indicator */}
            <div className="text-white text-sm">
              <span className="font-bold">{answeredCount}</span>({totalPlayers})
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={onPauseToggle}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isPaused ? (
                  <PlayIcon className="w-5 h-5 text-white" />
                ) : (
                  <PauseIcon className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={onNext}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ForwardIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative inset-0">{children}</div>

      {/* Pause Overlay */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <div className="text-white text-4xl font-bold">Game Paused</div>
        </motion.div>
      )}
    </div>
  );
};

export default PlayLayout;
