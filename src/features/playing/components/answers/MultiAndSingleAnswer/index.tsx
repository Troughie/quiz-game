import { motion as m, useAnimationControls } from "framer-motion";
import { useMemo } from "react";
import type { Answer, Question } from "@/features/createQuiz/type";
import {
    ANIMATION_CONFIG,
    ANIMATION_STATES,
    QUESTION_TYPES,
    type QuestionType,
} from "../../../constant";
import { useAnimationEffects } from "./hooks/useAnimationEffects";
import { useAnswerStyles } from "./hooks/useAnswerStyles";
import { useShouldShowIndicator } from "./hooks/useShouldShownIndicator";
import AnswerIndicator from "./components/AnswerIndicator";
import { AnswerCheckbox } from "./components/AnswerCheckbox";
import { useDimmedLogic } from "./hooks/useDimmedLogic";
import { useAnimationState } from "./hooks/useAnimationState";

export interface MultiAndSingleAnswerProps {
    answer: Answer;
    question: Question;
    index: number;
    isAnswerCorrect?: boolean;
    showingCorrectAnswer?: boolean;
    selectedAnswers: number[];
    handleAnswerClick: (index: number) => void;
    disabled?: boolean;
    isPause?: boolean;
}

const MultiAndSingleAnswer = ({
    answer,
    index,
    question,
    isAnswerCorrect = false,
    selectedAnswers,
    handleAnswerClick,
    showingCorrectAnswer = false,
    disabled = false,
    isPause = false,
}: MultiAndSingleAnswerProps) => {
    const controls = useAnimationControls();
    const indicatorControls = useAnimationControls();

    // Computed values
    const isSelected = selectedAnswers.includes(index);
    const questionType = (question.type ||
        QUESTION_TYPES.BUTTON_SLIDE) as QuestionType;
    const hasAnySelected = selectedAnswers.length > 0;

    // Animation variants configuration
    const itemVariants = useMemo(
        () => ({
            [ANIMATION_STATES.INITIAL]: { opacity: 0, x: -60 },
            [ANIMATION_STATES.ANIMATE]: {
                opacity: 1,
                x: 0,
                transition: {
                    duration: ANIMATION_CONFIG.duration,
                    delay:
                        ANIMATION_CONFIG.baseDelay +
                        index * ANIMATION_CONFIG.indexDelay,
                },
            },
            [ANIMATION_STATES.UNSELECTED]: {
                opacity: 0.2,
                x: 0,
                transition: { duration: 0.1 },
            },
            [ANIMATION_STATES.FINISHED]: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.1 },
            },
        }),
        [index]
    );

    // Business logic hooks
    const isDimmed = useDimmedLogic(
        questionType,
        hasAnySelected,
        isSelected,
        isAnswerCorrect
    );
    const animationState = useAnimationState(showingCorrectAnswer, isDimmed);

    const shouldShowIndicator = useShouldShowIndicator(
        showingCorrectAnswer,
        questionType,
        isAnswerCorrect,
        isSelected
    );
    const answerStyles = useAnswerStyles(
        questionType,
        showingCorrectAnswer,
        isAnswerCorrect,
        isSelected,
        isDimmed,
        disabled
    );

    // Animation effects
    useAnimationEffects({
        isPause,
        controls,
        indicatorControls,
        animationState,
        shouldShowIndicator,
        index,
        isAnswerCorrect,
        isSelected,
    });

    // Event handlers
    const handleClick = () => !disabled && handleAnswerClick(index);

    const handleAnimationComplete = () => {
        if (isPause) return;
    };

    return (
        <m.button
            animate={controls}
            variants={itemVariants}
            initial={ANIMATION_STATES.INITIAL}
            onAnimationComplete={handleAnimationComplete}
            onClick={handleClick}
            className={answerStyles}
        >
            <div className="flex items-center">
                <AnswerCheckbox
                    questionType={questionType}
                    isSelected={isSelected}
                />
                <span>{answer.text}</span>
            </div>

            <AnswerIndicator
                shouldShow={shouldShowIndicator}
                questionType={questionType}
                isAnswerCorrect={isAnswerCorrect}
                isSelected={isSelected}
                controls={indicatorControls}
            />
        </m.button>
    );
};

export default MultiAndSingleAnswer;
