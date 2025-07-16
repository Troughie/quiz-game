import { XMarkIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { AnimationControls } from "framer-motion";
import {
    ANIMATION_CONFIG,
    QUESTION_TYPES,
    type QuestionType,
} from "../../../../constant";
import { motion as m } from "framer-motion";
import cn from "@/HOC/cn";

interface AnswerIndicatorProps {
    shouldShow: boolean;
    questionType: QuestionType;
    isAnswerCorrect: boolean;
    isSelected: boolean;
    controls: AnimationControls;
}

const AnswerIndicator = ({
    shouldShow,
    questionType,
    isAnswerCorrect,
    controls,
}: AnswerIndicatorProps) => {
    if (!shouldShow) return null;

    const isCheckbox = questionType === QUESTION_TYPES.CHECKBOX_SLIDE;

    const getIcon = () =>
        isAnswerCorrect ? (
            <CheckIcon className="h-4 w-4 text-white" />
        ) : (
            <XMarkIcon className="h-4 w-4 text-white" />
        );

    const getClassName = () =>
        cn(
            "absolute bottom-2 right-2 p-1",
            isAnswerCorrect
                ? "bg-green-500 rounded-full"
                : "bg-red-500 rounded-lg"
        );

    return (
        <m.div
            animate={controls}
            initial={{ scale: 0 }}
            transition={{
                type: "spring",
                duration: ANIMATION_CONFIG.springDuration,
            }}
            className={
                isCheckbox
                    ? getClassName()
                    : "absolute bottom-2 right-2 bg-green-500 rounded-full p-1"
            }
        >
            {isCheckbox ? (
                getIcon()
            ) : (
                <CheckIcon className="h-4 w-4 text-white" />
            )}
        </m.div>
    );
};

export default AnswerIndicator;
