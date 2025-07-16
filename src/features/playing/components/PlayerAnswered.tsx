import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { PlayerScore } from "../types/Index";
import cn from "@/HOC/cn";
import { SCORE } from "../constant";
interface PlayerAnsweredProps {
    playerAnswer: PlayerScore[];
    playerCorrect?: PlayerScore[];
    showingAnswer?: boolean;
}
const PlayerAnswered = ({
    playerAnswer,
    playerCorrect,
    showingAnswer,
}: PlayerAnsweredProps) => {
    return (
        <div className="flex gap-4 items-center text-white justify-center">
            {playerAnswer?.map((player, i) => {
                const isCorrect = playerCorrect?.find(
                    (e) => e.id === player?.id
                );
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        key={i}
                        className={cn(
                            "flex flex-col relative items-center gap-2"
                        )}
                    >
                        <div className="relative rounded-full">
                            <div className=" size-20 relative rounded-full border-black border-2">
                                <div className="inset-0 absolute rounded-full p-1 border-green-500 border-2 bg-white/20 flex items-center justify-center">
                                    {player?.avatar && (
                                        <img
                                            src={player?.avatar}
                                            className="size-full rounded-full"
                                        />
                                    )}
                                </div>
                            </div>
                            {player?.score > SCORE.MIN && (
                                <span className="absolute font-bold text-outline-black text-lg -bottom-2 right-5">
                                    {player?.score}
                                </span>
                            )}
                            {showingAnswer && !isCorrect && (
                                <div className="absolute inset-0 bg-black/50 rounded-full" />
                            )}
                            {showingAnswer && isCorrect && (
                                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                    <CheckIcon className="size-4 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-outline-black font-bold">
                            {" "}
                            {player?.username}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PlayerAnswered;
