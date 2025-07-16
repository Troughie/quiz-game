import { memo } from "react";
import type { PlayerScore } from "../../types/Index";
import { motion } from "framer-motion";
interface PodiumProps {
    player: PlayerScore;
    position: 1 | 2 | 3;
    isVisible: boolean;
}
const PodiumPlayer = memo(({ player, position, isVisible }: PodiumProps) => {
    const heights = {
        1: "h-20 sm:h-24 lg:h-32",
        2: "h-16 sm:h-20 lg:h-24",
        3: "h-12 sm:h-16 lg:h-20",
    };
    const bgColors = {
        1: "bg-gradient-to-t from-yellow-600 to-yellow-400",
        2: "bg-gradient-to-t from-gray-500 to-gray-300",
        3: "bg-gradient-to-t from-amber-700 to-amber-500",
    };
    const textColors = {
        1: "text-yellow-400",
        2: "text-gray-300",
        3: "text-amber-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 50,
                scale: isVisible ? 1 : 0.8,
            }}
            transition={{
                duration: 0.8,
                type: "spring",
                damping: 20,
                stiffness: 100,
            }}
            className="flex flex-col items-center"
        >
            <div className="mb-2 sm:mb-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-white/20 flex items-center justify-center mb-1 sm:mb-2 mx-auto">
                    {player.avatar ? (
                        <img
                            src={player.avatar}
                            alt={player.username}
                            className="w-full h-full rounded-full"
                        />
                    ) : (
                        <span className="text-white text-sm sm:text-lg lg:text-xl font-bold">
                            {player.username[0]}
                        </span>
                    )}
                </div>
                <div className="text-white font-medium text-xs sm:text-sm lg:text-base max-w-16 sm:max-w-20 lg:max-w-24 truncate">
                    {player.username}
                </div>
                <div
                    className={`font-bold text-sm sm:text-base lg:text-lg ${textColors[position]}`}
                >
                    {player.score}
                </div>
            </div>
            <div
                className={`w-12 sm:w-16 lg:w-20 ${heights[position]} ${bgColors[position]} rounded-t-lg flex items-end justify-center pb-1 sm:pb-2`}
            >
                <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                    {position}
                </span>
            </div>
        </motion.div>
    );
});

PodiumPlayer.displayName = "PodiumPlayer";
export default PodiumPlayer;
