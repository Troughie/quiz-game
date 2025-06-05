import { AnimatePresence, motion } from "framer-motion";
import { notifyAnimationDone } from "../helper";
import { QUESTION_PHASE, type PlayerScore } from "../types/Index";
import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

interface ScoreBoardProps {
  players: PlayerScore[];
  isPaused: boolean;
}

export interface ScoreBoardRef {
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  resetAnimation: () => void;
  skipToEnd: () => void;
}

const ScoreBoard = forwardRef<ScoreBoardRef, ScoreBoardProps>(
  ({ players, isPaused }, ref) => {
    const [animationPhase, setAnimationPhase] = useState<
      "initial" | "showPoints" | "addPoints" | "reorder"
    >("initial");
    const [sortedPlayers, setSortedPlayers] = useState<PlayerScore[]>([]);
    const [isAnimationPaused, setIsAnimationPaused] = useState(isPaused);

    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
    const startTimeRef = useRef<number>(0);
    const elapsedTimeRef = useRef<number>(0);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      pauseAnimation: () => {
        setIsAnimationPaused(true);
        clearAllTimeouts();
        elapsedTimeRef.current += Date.now() - startTimeRef.current;
      },

      resumeAnimation: () => {
        setIsAnimationPaused(false);
        startTimeRef.current = Date.now();
        continueAnimation();
      },

      resetAnimation: () => {
        clearAllTimeouts();
        setAnimationPhase("initial");
        setSortedPlayers(
          [...players].sort((a, b) => b.prevScore - a.prevScore)
        );
        elapsedTimeRef.current = 0;
        setIsAnimationPaused(false);
        startAnimation();
      },

      skipToEnd: () => {
        clearAllTimeouts();
        setAnimationPhase("reorder");
        setSortedPlayers([...players].sort((a, b) => b.score - a.score));
        setIsAnimationPaused(false);
        notifyAnimationDone(QUESTION_PHASE.DISPLAY_SCOREBOARD);
      },
    }));

    const clearAllTimeouts = () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
    };

    const continueAnimation = () => {
      const remainingPhases = [
        {
          phase: "showPoints",
          delay: Math.max(0, 500 - elapsedTimeRef.current),
        },
        {
          phase: "addPoints",
          delay: Math.max(0, 2000 - elapsedTimeRef.current),
        },
        { phase: "reorder", delay: Math.max(0, 3000 - elapsedTimeRef.current) },
        {
          phase: "complete",
          delay: Math.max(0, 4000 - elapsedTimeRef.current),
        },
      ];

      remainingPhases.forEach(({ phase, delay }) => {
        if (delay >= 0) {
          const timeout = setTimeout(() => {
            if (!isAnimationPaused) {
              if (phase === "showPoints") {
                setAnimationPhase("showPoints");
              } else if (phase === "addPoints") {
                setAnimationPhase("addPoints");
              } else if (phase === "reorder") {
                setAnimationPhase("reorder");
                setSortedPlayers(
                  [...players].sort((a, b) => b.score - a.score)
                );
              } else if (phase === "complete") {
                notifyAnimationDone(QUESTION_PHASE.DISPLAY_SCOREBOARD);
              }
            }
          }, delay);
          timeoutRefs.current.push(timeout);
        }
      });
    };

    const startAnimation = () => {
      startTimeRef.current = Date.now();
      elapsedTimeRef.current = 0;

      const timeout1 = setTimeout(() => {
        if (!isAnimationPaused) setAnimationPhase("showPoints");
      }, 500);

      const timeout2 = setTimeout(() => {
        if (!isAnimationPaused) setAnimationPhase("addPoints");
      }, 2000);

      const timeout3 = setTimeout(() => {
        if (!isAnimationPaused) {
          setAnimationPhase("reorder");
          setSortedPlayers([...players].sort((a, b) => b.score - a.score));
        }
      }, 3000);

      const timeout4 = setTimeout(() => {
        if (!isAnimationPaused) {
          notifyAnimationDone(QUESTION_PHASE.DISPLAY_SCOREBOARD);
        }
      }, 4000);

      timeoutRefs.current = [timeout1, timeout2, timeout3, timeout4];
    };

    useEffect(() => {
      clearAllTimeouts();
      setSortedPlayers([...players].sort((a, b) => b.prevScore - a.prevScore));

      if (!isAnimationPaused) {
        startAnimation();
      }

      return () => clearAllTimeouts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [players]);

    useEffect(() => {
      setIsAnimationPaused(isPaused);
      if (isPaused) {
        clearAllTimeouts();
        elapsedTimeRef.current += Date.now() - startTimeRef.current;
      } else {
        startTimeRef.current = Date.now();
        continueAnimation();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPaused]);

    return (
      <motion.div
        className="inset-0 absolute bg-black/80 flex items-center justify-center z-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimationPaused ? 0.5 : 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Scoreboard
          </h2>
          <div className="space-y-4 relative">
            <AnimatePresence>
              {sortedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: isAnimationPaused ? 0 : index * 0.1,
                    duration: isAnimationPaused ? 0 : 0.5,
                    layout: {
                      duration: isAnimationPaused ? 0 : 0.8,
                      type: "spring",
                    },
                  }}
                  className="flex items-center justify-between bg-white/20 p-4 rounded-lg relative"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      {player.avatar ? (
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-white">{player.name[0]}</span>
                      )}
                    </div>
                    <span className="text-white font-medium">
                      {player.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.span
                      key={`score-${player.id}-${animationPhase}`}
                      initial={{
                        scale:
                          animationPhase === "addPoints" && !isAnimationPaused
                            ? 0.8
                            : 1,
                      }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: isAnimationPaused ? 0 : undefined,
                      }}
                      className="text-white font-bold text-xl"
                    >
                      {animationPhase === "initial" ||
                      animationPhase === "showPoints"
                        ? player.prevScore
                        : player.score}
                    </motion.span>

                    {player.newPoints &&
                      player.newPoints > 0 &&
                      (animationPhase === "showPoints" ||
                        animationPhase === "addPoints") && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity:
                              animationPhase === "showPoints" &&
                              !isAnimationPaused
                                ? 1
                                : 0,
                            x:
                              animationPhase === "showPoints" &&
                              !isAnimationPaused
                                ? 0
                                : 10,
                          }}
                          transition={{ duration: isAnimationPaused ? 0 : 0.3 }}
                          className="flex items-center"
                        >
                          <span className="text-white mx-1">+</span>
                          <span className="text-green-400 font-medium">
                            {player.newPoints}
                          </span>
                        </motion.div>
                      )}

                    {player.newPoints &&
                      player.newPoints > 0 &&
                      animationPhase === "addPoints" && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5, x: -20 }}
                          animate={{
                            opacity: isAnimationPaused ? 0 : 1,
                            scale: isAnimationPaused ? 0.5 : 1.2,
                            x: 0,
                          }}
                          transition={{ duration: isAnimationPaused ? 0 : 0.5 }}
                          className="text-green-400 font-medium absolute right-4"
                        >
                          +{player.newPoints}
                        </motion.span>
                      )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }
);

ScoreBoard.displayName = "ScoreBoard";

export default ScoreBoard;
