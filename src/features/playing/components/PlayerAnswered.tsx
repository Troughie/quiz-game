import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { PlayerScore } from "../types/Index";
import cn from "@/HOC/cn";
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
      {playerAnswer.map((player) => {
        const isCorrect = playerCorrect?.find((e) => e.id === player.id);
        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              key={player.id}
              className={cn("flex flex-col relative items-center gap-4")}
            >
              <div className="size-14 relative rounded-full bg-green-500">
                {showingAnswer && !isCorrect && (
                  <div className="absolute inset-0 bg-black/50 rounded-full" />
                )}
                {showingAnswer && isCorrect && (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                    <CheckIcon className="size-4 text-white" />
                  </div>
                )}
              </div>
              <span>{player.name}</span>
            </motion.div>
          </>
        );
      })}
    </div>
  );
};

export default PlayerAnswered;
