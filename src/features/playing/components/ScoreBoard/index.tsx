import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import PodiumPlayer from "./PodiumPlayer";
import ListPlayer from "./ListPlayers";
import { type PlayerScore } from "../../types/Index";
import Button, { type ButtonVariant } from "@/components/ui/ButtonCustom";

interface ScoreBoardProps {
    players: PlayerScore[];
    isPaused: boolean;
    lastQuestion: boolean;
    isHost: boolean;
    doneQuiz: () => void;
}
interface ButtonScoreBoardProps {
    text: string;
    variant: ButtonVariant;
    type: "Report" | "Done";
}
const buttonScoreBoard: ButtonScoreBoardProps[] = [
    { text: "View report", variant: "info", type: "Report" },
    { text: "Done", variant: "secondary", type: "Done" },
];

const ScoreBoard = ({
    players,
    isPaused,
    lastQuestion = false,
    isHost,
    doneQuiz,
}: ScoreBoardProps) => {
    const [animationPhase, setAnimationPhase] = useState<
        "initial" | "showPoints" | "addPoints" | "reorder" | "podium"
    >("initial");
    const [sortedPlayers, setSortedPlayers] = useState<PlayerScore[]>([]);
    const [isAnimationPaused, setIsAnimationPaused] = useState(isPaused);
    const [podiumVisible, setPodiumVisible] = useState<{
        3: boolean;
        2: boolean;
        1: boolean;
    }>({ 3: false, 2: false, 1: false });

    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
    const startTimeRef = useRef<number>(0);
    const elapsedTimeRef = useRef<number>(0);

    const clearAllTimeouts = () => {
        timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
        timeoutRefs.current = [];
    };

    const continueAnimation = () => {
        const basePhases = [];

        if (lastQuestion) {
            basePhases.push(
                {
                    phase: "podium",
                    delay: Math.max(0, 4000 - elapsedTimeRef.current),
                },
                {
                    phase: "showTop3",
                    delay: Math.max(0, 5000 - elapsedTimeRef.current),
                },
                {
                    phase: "showTop2",
                    delay: Math.max(0, 6000 - elapsedTimeRef.current),
                },
                {
                    phase: "showTop1",
                    delay: Math.max(0, 7000 - elapsedTimeRef.current),
                },
                {
                    phase: "showRemaining",
                    delay: Math.max(0, 8000 - elapsedTimeRef.current),
                },
                {
                    phase: "complete",
                    delay: Math.max(0, 9000 - elapsedTimeRef.current),
                }
            );
        } else {
            basePhases.push(
                {
                    phase: "showPoints",
                    delay: Math.max(0, 500 - elapsedTimeRef.current),
                },
                {
                    phase: "addPoints",
                    delay: Math.max(0, 2000 - elapsedTimeRef.current),
                },
                {
                    phase: "reorder",
                    delay: Math.max(0, 3000 - elapsedTimeRef.current),
                },
                {
                    phase: "complete",
                    delay: Math.max(0, 4000 - elapsedTimeRef.current),
                }
            );
        }

        basePhases.forEach(({ phase, delay }) => {
            if (delay >= 0) {
                const timeout = setTimeout(() => {
                    if (!isAnimationPaused) {
                        switch (phase) {
                            case "showPoints":
                                setAnimationPhase("showPoints");
                                break;
                            case "addPoints":
                                setAnimationPhase("addPoints");
                                break;
                            case "reorder":
                                setAnimationPhase("reorder");
                                setSortedPlayers(
                                    [...players].sort(
                                        (a, b) => b.score - a.score
                                    )
                                );
                                break;
                            case "podium":
                                setAnimationPhase("podium");
                                break;
                            case "showTop3":
                                setPodiumVisible((prev) => ({
                                    ...prev,
                                    3: true,
                                }));
                                break;
                            case "showTop2":
                                setPodiumVisible((prev) => ({
                                    ...prev,
                                    2: true,
                                }));
                                break;
                            case "showTop1":
                                setPodiumVisible((prev) => ({
                                    ...prev,
                                    1: true,
                                }));
                                break;
                            default:
                                break;
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

        let timeouts = [];

        if (lastQuestion) {
            const timeout4 = setTimeout(() => {
                if (!isAnimationPaused) {
                    setAnimationPhase("podium");
                }
            }, 2000);

            const timeout5 = setTimeout(() => {
                if (!isAnimationPaused) {
                    setPodiumVisible((prev) => ({ ...prev, 3: true }));
                }
            }, 3000);

            const timeout6 = setTimeout(() => {
                if (!isAnimationPaused) {
                    setPodiumVisible((prev) => ({ ...prev, 2: true }));
                }
            }, 4000);

            const timeout7 = setTimeout(() => {
                if (!isAnimationPaused) {
                    setPodiumVisible((prev) => ({ ...prev, 1: true }));
                }
            }, 5000);

            timeouts = [timeout4, timeout5, timeout6, timeout7];
        } else {
            const timeout1 = setTimeout(() => {
                if (!isAnimationPaused) setAnimationPhase("showPoints");
            }, 500);

            const timeout2 = setTimeout(() => {
                if (!isAnimationPaused) setAnimationPhase("addPoints");
            }, 2000);

            const timeout3 = setTimeout(() => {
                if (!isAnimationPaused) {
                    setAnimationPhase("reorder");
                    setSortedPlayers(
                        [...players].sort((a, b) => b.score - a.score)
                    );
                }
            }, 3000);

            timeouts = [timeout1, timeout2, timeout3];
        }

        timeoutRefs.current = timeouts;
    };

    useEffect(() => {
        clearAllTimeouts();
        setSortedPlayers(
            [...players].sort((a, b) => b.prevScore - a.prevScore)
        );
        setPodiumVisible({ 3: false, 2: false, 1: false });

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

    const handleClickButton = (type: "Report" | "Done") => {
        if (type === "Done") {
            doneQuiz();
        }
    };

    if (lastQuestion) {
        const topPlayers = sortedPlayers
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        return (
            <>
                <motion.div
                    className="inset-0 top-17 fixed bg-gradient-to-br z-1 from-gray-900 via-black to-gray-900 flex flex-col p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Action Buttons */}
                    {isHost && podiumVisible[1] && (
                        <div
                            className="
        absolute flex flex-wrap justify-center mb-4 sm:mb-8 top-16 right-2 gap-2 sm:top-24 sm:left-4 sm:right-4 sm:gap-3 lg:top-30 lg:right-15 lg:left-auto lg:gap-4 max-w-full"
                        >
                            {buttonScoreBoard.map(
                                ({ text, variant, type }, index) => (
                                    <Button
                                        key={index}
                                        text={text}
                                        variant={variant}
                                        onClick={() => handleClickButton(type)}
                                    />
                                )
                            )}
                        </div>
                    )}

                    <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
                        {/* Title - Fixed */}
                        <motion.h2
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4 sm:mb-6 lg:mb-8 flex-shrink-0"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            🏆 Final Results 🏆
                        </motion.h2>

                        {/* Podium - Fixed */}
                        <div className="flex items-end justify-center gap-2 sm:gap-4 lg:gap-8 mb-6 sm:mb-8 lg:mb-12 flex-shrink-0">
                            {/* Mobile: Stack vertically on very small screens */}
                            <div className="hidden xs:flex items-end justify-center gap-2 sm:gap-4 lg:gap-8">
                                {/* Second Place */}
                                {topPlayers[1] && (
                                    <PodiumPlayer
                                        player={topPlayers[1]}
                                        position={2}
                                        isVisible={podiumVisible[2]}
                                    />
                                )}

                                {/* First Place */}
                                {topPlayers[0] && (
                                    <PodiumPlayer
                                        player={topPlayers[0]}
                                        position={1}
                                        isVisible={podiumVisible[1]}
                                    />
                                )}

                                {/* Third Place */}
                                {topPlayers[2] && (
                                    <PodiumPlayer
                                        player={topPlayers[2]}
                                        position={3}
                                        isVisible={podiumVisible[3]}
                                    />
                                )}
                            </div>

                            {/* Very small screens: Show horizontal layout */}
                            <div className="flex xs:hidden items-end justify-center gap-1 overflow-x-auto w-full">
                                {topPlayers.map((player, index) => (
                                    <PodiumPlayer
                                        key={player.id}
                                        player={player}
                                        position={(index + 1) as 1 | 2 | 3}
                                        isVisible={
                                            podiumVisible[
                                                (index + 1) as 1 | 2 | 3
                                            ]
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Complete Rankings List - Scrollable */}
                        <div className="flex-1 overflow-hidden">
                            <div className="max-w-2xl mx-auto h-full">
                                <div className="h-full overflow-y-auto space-y-2 sm:space-y-3 pr-2">
                                    {sortedPlayers.map((player, index) => {
                                        const position = index + 1;
                                        return (
                                            <ListPlayer
                                                key={player.id}
                                                player={player}
                                                position={position}
                                                isVisible={
                                                    podiumVisible[
                                                        Math.min(
                                                            position,
                                                            3
                                                        ) as 1 | 2 | 3
                                                    ]
                                                }
                                                delay={
                                                    position > 3
                                                        ? (position - 4) * 0.1
                                                        : 0
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        );
    }

    return (
        <motion.div
            className="inset-0 fixed top-17 bg-black z-2 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: isAnimationPaused ? 0.5 : 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex flex-col h-full max-w-2xl  p-8 w-full">
                {/* Title - Fixed */}
                <h2 className="text-3xl font-bold text-white text-center mb-6 flex-shrink-0">
                    Scoreboard
                </h2>

                {/* Players List - Scrollable */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto space-y-4 pr-2">
                        <AnimatePresence>
                            {sortedPlayers.map((player, index) => (
                                <motion.div
                                    key={player._id}
                                    layoutId={`player-${player.id}`}
                                    layout
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        delay: isAnimationPaused
                                            ? 0
                                            : index * 0.1,
                                        duration: isAnimationPaused ? 0 : 0.5,
                                        layout: {
                                            duration: isAnimationPaused
                                                ? 0
                                                : 0.8,
                                            type: "spring",
                                        },
                                    }}
                                    className="flex items-center relative justify-between bg-white/20 p-4 rounded-lg flex-shrink-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            {player.avatar ? (
                                                <img
                                                    src={player.avatar}
                                                    alt={player.username}
                                                    className="w-full h-full rounded-full"
                                                />
                                            ) : (
                                                <span className="text-white">
                                                    {player.username?.[0] ?? ""}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-white font-medium">
                                            {player.username}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <motion.span
                                            key={`score-${player.id}-${animationPhase}`}
                                            initial={{
                                                scale:
                                                    animationPhase ===
                                                        "addPoints" &&
                                                    !isAnimationPaused
                                                        ? 0.8
                                                        : 1,
                                            }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                duration: isAnimationPaused
                                                    ? 0
                                                    : undefined,
                                            }}
                                            className="text-white font-bold text-xl"
                                        >
                                            {animationPhase === "initial" ||
                                            animationPhase === "showPoints"
                                                ? player.prevScore
                                                : player.score}
                                        </motion.span>
                                    </div>
                                    {player.newPoints &&
                                        player.newPoints > 0 &&
                                        (animationPhase === "showPoints" ||
                                            animationPhase === "addPoints") && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: -10,
                                                }}
                                                animate={{
                                                    opacity:
                                                        animationPhase ===
                                                            "showPoints" &&
                                                        !isAnimationPaused
                                                            ? 1
                                                            : 0,
                                                    y:
                                                        animationPhase ===
                                                            "showPoints" &&
                                                        !isAnimationPaused
                                                            ? 0
                                                            : 10,
                                                }}
                                                transition={{
                                                    duration: isAnimationPaused
                                                        ? 0
                                                        : 0.3,
                                                }}
                                                className="flex items-center absolute top-5 -right-11"
                                            >
                                                <span className="text-white mx-1">
                                                    +
                                                </span>
                                                <span className="text-green-400 font-medium">
                                                    {player.newPoints}
                                                </span>
                                            </motion.div>
                                        )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ScoreBoard;
