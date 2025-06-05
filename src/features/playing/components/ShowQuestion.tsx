import { useEffect, useState } from "react";
import { motion as m } from "framer-motion";
import Button from "@/components/ui/ButtonCustom";
import { TimerBar } from "./TimerBar";
import { QuestionMedia } from "./QuestionMedia";
import { useTypewriter } from "../hooks/useTypewriter";
import { useQuestionTimer } from "../hooks/useQuestionTimer";
import type { Question } from "../types/Index";
import ShowAnswers from "./answers/ShowAnswers";
import { TIME_SHOW_QUESTION } from "../constant";

// Define question handler type for type safety
type QuestionHandler = (index: number) => void;

interface QuestionHandlers {
  [key: string]: QuestionHandler;
}

interface ShowQuestionProps {
  question: Question;
  isPaused?: boolean;
  isTimeTravel: boolean;
  indexAnswersCorrect: number[];
  startAt?: number;
  showingFunfact: boolean;
  submitAnswer: (answers: number[], timeClick: number) => void;
  countDownDuration?: number;
  startCountdown: boolean;
  skipCountdown: boolean;
  remainingTime?: number;
  countdownSpeed: number;
  getSyncedTime: () => number;
}

const ShowQuestion = ({
  question,
  isPaused = false,
  indexAnswersCorrect,
  startAt,
  showingFunfact,
  submitAnswer,
  countDownDuration = 15000,
  startCountdown,
  skipCountdown,
  remainingTime,
  countdownSpeed,
  getSyncedTime,
}: ShowQuestionProps) => {
  // Component state
  const [showAnswers, setShowAnswers] = useState(false);
  const [answersAnimation, setAnswersAnimation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Custom hooks
  const { isComplete, displayText: questionText } = useTypewriter(
    question?.question || "",
    isPaused,
    TIME_SHOW_QUESTION
  );

  const { timeLeft, timeClick, score, recordTimeClick, percent } =
    useQuestionTimer({
      duration: countDownDuration,
      startAt,
      isPaused,
      startCountdown,
      skipCountdown,
      remainingTime: remainingTime,
      countdownSpeed: countdownSpeed,
      getSyncedTime: getSyncedTime,
    });

  // Reset states when question changes
  useEffect(() => {
    setSelectedAnswers([]);
    setHasSubmitted(false);
    if (isComplete) {
      setTimeout(() => {
        setShowAnswers(true);
      }, 1000);
    }
  }, [isComplete, question]);

  // Helper function to handle answer submission
  const handleSubmitAnswer = (answers: number[]) => {
    if (!hasSubmitted && timeLeft > 0) {
      const actualTimeClick = recordTimeClick();
      console.log("TimeClick before submit:", actualTimeClick);
      submitAnswer(answers, actualTimeClick);
      setHasSubmitted(true);
    }
  };

  // Question type specific handlers with improved type safety
  const questionHandlers: QuestionHandlers = {
    buttonSlide: (index: number) => {
      if (!hasSubmitted) {
        setSelectedAnswers([index]);
        handleSubmitAnswer([index]);
      }
    },
    checkBoxSlide: (index: number) => {
      if (!hasSubmitted) {
        setSelectedAnswers((prev) => {
          const newAnswers = prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index];
          return newAnswers;
        });
      }
    },
    reorderSlide: (index: number) => {
      if (!hasSubmitted) {
        // Handle reorder logic here
        setSelectedAnswers((prev) => {
          // Add the index in order they were clicked
          if (!prev.includes(index)) {
            return [...prev, index];
          }
          return prev;
        });
      }
    },
    rangeSlide: (index: number) => {
      if (!hasSubmitted) {
        setSelectedAnswers([index]);
        handleSubmitAnswer([index]);
      }
    },
    // Future question types can be added here
  };

  const handleAnswerClick = (index: number) => {
    if (!startAt || timeLeft === 0) return;

    const handler =
      questionHandlers[question?.type as keyof typeof questionHandlers];
    if (handler) {
      handler(index);
    }
  };

  const handleSubmitCheckBoxButton = () => {
    if (selectedAnswers.length > 0) {
      handleSubmitAnswer(selectedAnswers);
    }
  };

  const handleAnimationAnswerComplete = (value: boolean) => {
    setTimeout(() => {
      setAnswersAnimation(value);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl relative mx-auto p-4 flex flex-col md:flex-row gap-8 items-start">
      {/* Left side - Question and Answers */}
      <div className="grid grid-cols-6 space-x-12 md:space-y-8">
        <div className="col-span-3 flex flex-col gap-8">
          {/* Question with typewriter effect */}
          <m.div className="text-3xl font-bold text-white min-h-[6rem]">
            {questionText}
            <span className="animate-pulse">|</span>
          </m.div>

          {/* Answers */}
          <>
            {showAnswers && (
              <div className="space-y-4">
                {question?.answers?.map((answer, index) => {
                  const isLast = index === (question?.answers?.length ?? 0) - 1;
                  return (
                    <ShowAnswers
                      key={index}
                      question={question}
                      answer={answer}
                      handleAnswerClick={handleAnswerClick}
                      index={index}
                      disabled={hasSubmitted}
                      selectedAnswers={selectedAnswers}
                      isAnswerCorrect={
                        indexAnswersCorrect?.length > 0 &&
                        indexAnswersCorrect.includes(index)
                      }
                      isPause={isPaused}
                      isLast={isLast}
                      showingCorrectAnswer={indexAnswersCorrect?.length > 0}
                      animationComplete={handleAnimationAnswerComplete}
                    />
                  );
                })}

                {question.type === "checkBoxSlide" && answersAnimation && (
                  <m.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <Button
                      onClick={handleSubmitCheckBoxButton}
                      text="Submit"
                      variant="success"
                      disabled={hasSubmitted}
                    />
                  </m.div>
                )}
              </div>
            )}
          </>

          {/* Timer */}
          {startCountdown && (
            <m.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <TimerBar
                startCountDown={startCountdown}
                isPaused={false}
                duration={countDownDuration}
                timeClick={timeClick}
                percent={percent}
                score={score}
              />
            </m.div>
          )}
        </div>
        {answersAnimation && (
          <div className="col-span-3">
            {/* Right side - Media and Fun Fact */}
            <QuestionMedia
              media={question?.media}
              funFact={question?.funFact}
              showFunFact={showingFunfact}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowQuestion;
