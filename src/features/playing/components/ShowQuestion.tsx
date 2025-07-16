import { useCallback, useEffect, useMemo, useState } from "react";
import { motion as m } from "framer-motion";
import Button from "@/components/ui/ButtonCustom";
import { TimerBar } from "./TimerBar";
import { QuestionMedia } from "./QuestionMedia";
import { useTypewriter } from "../hooks/useTypewriter";
import { useQuestionTimer } from "../hooks/useQuestionTimer";
import type { Question, submitAnswer } from "../types/Index";
import { TIME_SHOW_QUESTION, type QuestionType } from "../constant";
import { AnswerComponents } from "./answers/Answers";
import type { GameState } from "../store/playingStore";
import cn from "@/HOC/cn";

// Define question handler type for type safety
type QuestionHandler = (index: number) => void;

interface QuestionHandlers {
    [key: string]: QuestionHandler;
}

interface ShowQuestionProps extends Omit<GameState, "phase"> {
    question: Question;
    submitAnswer: submitAnswer;
    getSyncedTime: () => number;
}

const ShowQuestion = ({
    question,
    isPaused = false,
    correctIndexes,
    startAt,
    showingFunfact,
    submitAnswer,
    countDownDuration,
    startCountdown,
    skipCountdown,
    remainingTime,
    countdownSpeed,
    getSyncedTime,
    showingAnswerCorrect,
    showAnswer,
    showMedia,
    isCorrectAnswerFillBlank,
    timeClick: serverClickRes,
    correctText,
    textPlayerAnswer,
}: ShowQuestionProps) => {
    // Component state
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Custom hooks
    const { displayText: questionText } = useTypewriter(
        question?.question || "",
        isPaused,
        TIME_SHOW_QUESTION,
        showAnswer
    );

    const { timeLeft, timeClick, score, recordTimeClick, percent } =
        useQuestionTimer({
            countDownDuration,
            startAt,
            isPaused,
            startCountdown,
            skipCountdown,
            remainingTime,
            countdownSpeed,
            getSyncedTime,
        });

    // Reset states when question changes
    useEffect(() => {
        setSelectedAnswers([]);
        setHasSubmitted(false);
    }, [question]);

    // Helper function to handle answer submission
    const handleSubmitAnswer = useCallback(
        (answers: number[]) => {
            if (!hasSubmitted && timeLeft > 0) {
                const actualTimeClick = recordTimeClick();
                console.log(actualTimeClick);

                submitAnswer({
                    timeClick: actualTimeClick,
                    indexAnswer: answers,
                    questionType:
                        (question.type as QuestionType) || "buttonSlide",
                });
                setHasSubmitted(true);
            }
        },
        [hasSubmitted, timeLeft, recordTimeClick, submitAnswer, question.type]
    );

    // Question type specific handlers with improved type safety
    const questionHandlers = useMemo<QuestionHandlers>(
        () => ({
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
        }),
        [hasSubmitted, handleSubmitAnswer]
    );

    const handleAnswerClick = useCallback(
        (index: number) => {
            if (timeLeft === 0) return;

            const handler =
                questionHandlers[
                    question?.type as keyof typeof questionHandlers
                ];
            if (handler) {
                handler(index);
            }
        },
        [question?.type, questionHandlers, timeLeft]
    );

    const handleAnswerSubmit = useCallback(
        (text: string) => {
            if (!hasSubmitted) {
                const actualTimeClick = recordTimeClick(false);
                submitAnswer({
                    timeClick: actualTimeClick,
                    textAnswer: text,
                    questionType:
                        (question.type as QuestionType) || "buttonSlide",
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [hasSubmitted, submitAnswer]
    );

    const handleSubmitCheckBoxButton = useCallback(() => {
        if (selectedAnswers.length > 0) {
            handleSubmitAnswer(selectedAnswers);
        }
    }, [handleSubmitAnswer, selectedAnswers]);

    return (
        <div className="w-full max-w-6xl relative mx-auto p-4 flex flex-col md:flex-row gap-8 items-start">
            {/* Left side - Question and Answers */}
            <div className="w-full max-w-6xl relative mx-auto p-4">
                <div
                    className={cn(
                        "flex flex-col md:flex-row gap-8",
                        question.media ? "items-start" : "justify-center"
                    )}
                >
                    {/* Left Side - Question and Answers */}
                    <div
                        className={cn(
                            "flex flex-col gap-8",
                            question.media
                                ? "w-full md:w-2/3"
                                : "w-full md:w-2/3 mx-auto"
                        )}
                    >
                        {/* Question with typewriter effect */}
                        <m.div className="text-3xl font-bold text-white min-h-[6rem]">
                            {questionText}
                            <span className="animate-pulse">|</span>
                        </m.div>

                        {/* Answers */}
                        {showAnswer && (
                            <div className="space-y-4">
                                <AnswerComponents
                                    QType={question.type as QuestionType}
                                    question={question}
                                    handleAnswerClick={handleAnswerClick}
                                    handleAnswerSubmit={handleAnswerSubmit}
                                    disabled={hasSubmitted}
                                    selectedAnswers={selectedAnswers}
                                    indexAnswersCorrect={correctIndexes}
                                    isPause={isPaused}
                                    showingCorrectAnswer={showingAnswerCorrect}
                                    isCorrectAnswerFillBlank={
                                        isCorrectAnswerFillBlank
                                    }
                                    correctText={correctText}
                                    textPlayerAnswer={textPlayerAnswer}
                                />

                                {question.type === "checkBoxSlide" && (
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

                        {/* Timer */}
                        {showAnswer && (
                            <m.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                                className="w-full"
                            >
                                <TimerBar
                                    startCountDown={startCountdown}
                                    duration={countDownDuration}
                                    timeClick={serverClickRes ?? timeClick}
                                    percent={percent}
                                    score={score}
                                />
                            </m.div>
                        )}
                    </div>

                    {/* Right Side - Media & Funfact */}
                    {(showMedia || showingFunfact) && (
                        <QuestionMedia
                            media={question?.media}
                            funFact={question?.funFact}
                            showFunFact={showingFunfact}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowQuestion;
