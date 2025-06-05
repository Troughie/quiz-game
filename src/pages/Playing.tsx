import ShowQuestion from "@/features/playing/components/ShowQuestion";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";
import { motion, AnimatePresence } from "framer-motion";
import PlayLayout from "@/features/playing/components/PlayLayout";
import ScoreBoard from "@/features/playing/components/ScoreBoard";
import { notifyAnimationDone } from "@/features/playing/helper";
import type { PlayingStore } from "@/features/playing/store/playingStore";
import { QUESTION_PHASE } from "@/features/playing/types/Index";
import Vote from "@/features/playing/components/Vote";
import PlayerAnswered from "@/features/playing/components/PlayerAnswered";

interface props {
  playState: Omit<PlayingStore, "handleGameUpdate" | "phase"> & {
    submitAnswer: (indexAnswer: number[], timeClick: number) => void;
  } & {
    resumeGame: () => void;
  } & {
    pauseGame: () => void;
  } & {
    nextQuestion: () => void;
  };
}
const Playing = ({ playState }: props) => {
  const { quizCurrent: quiz } = useQuizStore();
  const {
    currentQuestion,
    playerAnswer,
    playerCount,
    currentQuestionNumber,
    totalQuestions,
    showingAnswer,
    correctAnswer,
    showingScoreboard,
    showPreQuestion,
    startAt,
    showingFunfact,
    playerCorrect,
    showingVote,
    submitAnswer,
    isPaused,
    pauseGame,
    resumeGame,
    countdownDuration,
    startCountdown,
    skipCountdown,
    getSyncedTime,
    remainingTime,
    countdownSpeed,
    nextQuestion,
  } = playState;

  const resumeOrPauseGame = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const onNextQuestion = () => {
    nextQuestion();
  };
  return (
    <PlayLayout
      quiz={quiz}
      answeredCount={playerAnswer.length}
      totalPlayers={playerCount}
      currentQuestionIndex={currentQuestionNumber || 0}
      totalQuestions={totalQuestions || 0}
      isPaused={isPaused}
      onPauseToggle={resumeOrPauseGame}
      onNext={onNextQuestion}
    >
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-4"
          >
            <ShowQuestion
              question={currentQuestion}
              isPaused={isPaused}
              startAt={startAt}
              indexAnswersCorrect={correctAnswer}
              isTimeTravel={false}
              submitAnswer={submitAnswer}
              showingFunfact={showingFunfact}
              countDownDuration={countdownDuration}
              startCountdown={startCountdown}
              skipCountdown={skipCountdown}
              remainingTime={remainingTime}
              countdownSpeed={countdownSpeed}
              getSyncedTime={getSyncedTime}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <PlayerAnswered
          playerAnswer={playerAnswer}
          playerCorrect={playerCorrect}
          showingAnswer={showingAnswer}
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

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          notifyAnimationDone(QUESTION_PHASE.PRE_QUESTION);
        }}
      >
        {showPreQuestion && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black/80 text-white flex items-center justify-center text-4xl"
            >
              Hello start quiz
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showingScoreboard && (
          <ScoreBoard players={playerAnswer} isPaused={isPaused} />
        )}
      </AnimatePresence>
    </PlayLayout>
  );
};

export default Playing;
