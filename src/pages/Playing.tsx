import ShowQuestion from "@/features/playing/components/ShowQuestion";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";
import { motion, AnimatePresence } from "framer-motion";
import PlayLayout from "@/features/playing/components/PlayLayout";
import type { PlayingStore } from "@/features/playing/store/playingStore";
import { type submitAnswer } from "@/features/playing/types/Index";
import Vote from "@/features/playing/components/Vote";
import PlayerAnswered from "@/features/playing/components/PlayerAnswered";
import ScoreBoard from "@/features/playing/components/ScoreBoard";

interface props {
    playState: Omit<PlayingStore, "handleGameUpdate" | "phase"> & {
        submitAnswer: submitAnswer;
    } & {
        resumeGame: () => void;
    } & {
        pauseGame: () => void;
    } & {
        nextQuestion: () => void;
    } & {
        doneQuiz: () => void;
    };
}
const Playing = ({ playState }: props) => {
    const { quiz } = useQuizStore();
    const {
        currentQuestion,
        playerAnswer,
        totalPlayers,
        currentQuestionNumber,
        totalQuestions,
        showingAnswerCorrect,
        showingScoreboard,
        showPreQuestion,
        playerCorrect,
        showingVote,
        isPaused,
        pauseGame,
        resumeGame,
        nextQuestion,
        isLastQuestion,
        showingLastQuestion,
        isHost,
        doneQuiz,
    } = playState;

    const resumeOrPauseGame = () => {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    };

    return (
        <PlayLayout
            quiz={quiz}
            answeredCount={playerAnswer.length}
            totalPlayers={totalPlayers}
            currentQuestionIndex={currentQuestionNumber || 0}
            totalQuestions={totalQuestions || 0}
            isPaused={isPaused}
            onPauseToggle={resumeOrPauseGame}
            onNext={() => nextQuestion()}
        >
            <AnimatePresence mode="wait">
                {currentQuestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-center p-4"
                    >
                        <ShowQuestion
                            question={currentQuestion}
                            {...playState}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <PlayerAnswered
                    playerAnswer={playerAnswer}
                    playerCorrect={playerCorrect}
                    showingAnswer={showingAnswerCorrect}
                />
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {showingVote && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex items-center justify-center p-4"
                    >
                        <Vote quiz={quiz} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {showPreQuestion && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.5 }}
                            className="fixed inset-0 bg-black/80 text-white flex items-center justify-center text-4xl"
                        >
                            Hello start quiz
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {showingLastQuestion && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-white/20 text-white flex items-center justify-center text-4xl"
                    >
                        Last Question
                    </motion.div>
                )}
                z
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {showingScoreboard && (
                    <ScoreBoard
                        players={playerAnswer}
                        isPaused={isPaused}
                        lastQuestion={isLastQuestion}
                        isHost={isHost}
                        doneQuiz={doneQuiz}
                    />
                )}
            </AnimatePresence>
        </PlayLayout>
    );
};

export default Playing;
