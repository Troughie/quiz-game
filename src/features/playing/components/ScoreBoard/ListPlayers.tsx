import { memo } from "react";
import type { PlayerScore } from "../../types/Index";
import { motion } from "framer-motion";
interface ListPlayerProps {
    player: PlayerScore;
    position: number;
    isVisible: boolean;
    delay?: number;
}
const ListPlayer = memo(
    ({ player, position, isVisible, delay = 0 }: ListPlayerProps) => {
        return (
            <motion.div
                initial={{ opacity: 0, x: -50, height: 0 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -50,
                    height: isVisible ? "auto" : 0,
                }}
                transition={{
                    delay: isVisible ? delay : 0,
                    duration: 0.6,
                    type: "spring",
                    damping: 15,
                    stiffness: 100,
                    height: {
                        duration: 0.4,
                        ease: "easeInOut",
                    },
                }}
                className="overflow-hidden"
            >
                <div className="flex items-center justify-between bg-white/10 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className="text-white font-bold text-sm sm:text-base lg:text-lg flex-shrink-0">
                            #{position}
                        </span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            {player.avatar ? (
                                <img
                                    src={player.avatar}
                                    alt={player.username}
                                    className="w-full h-full rounded-full"
                                />
                            ) : (
                                <span className="text-white text-xs sm:text-sm">
                                    {player.username[0]}
                                </span>
                            )}
                        </div>
                        <span className="text-white font-medium text-sm sm:text-base truncate">
                            {player.username}
                        </span>
                    </div>
                    <span className="text-white font-bold text-sm sm:text-base lg:text-lg flex-shrink-0">
                        {player.score}
                    </span>
                </div>
            </motion.div>
        );
    }
);

ListPlayer.displayName = "ListPlayer";

export default ListPlayer;
