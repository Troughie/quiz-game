import { useMemo } from "react";
import { QUESTION_TYPES, type QuestionType } from "../../../../constant";
import { getButtonSlideStyles, getCheckboxSlideStyles } from "../helper";

export function useAnswerStyles(
  questionType: QuestionType,
  showingCorrectAnswer: boolean,
  isAnswerCorrect: boolean,
  isSelected: boolean,
  isDimmed: boolean,
  disabled: boolean
): string {
  return useMemo(() => {
    const baseStyles =
      "w-full p-4 rounded-lg text-lg relative group transition-all duration-300";

    if (questionType === QUESTION_TYPES.BUTTON_SLIDE) {
      return getButtonSlideStyles(
        baseStyles,
        showingCorrectAnswer,
        isAnswerCorrect,
        isSelected,
        isDimmed,
        disabled
      );
    }

    if (questionType === QUESTION_TYPES.CHECKBOX_SLIDE) {
      return getCheckboxSlideStyles(
        baseStyles,
        showingCorrectAnswer,
        isAnswerCorrect,
        isSelected,
        disabled
      );
    }

    return baseStyles;
  }, [
    questionType,
    showingCorrectAnswer,
    isAnswerCorrect,
    isSelected,
    isDimmed,
    disabled,
  ]);
}
