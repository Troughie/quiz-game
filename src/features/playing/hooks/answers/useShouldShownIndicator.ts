import { useMemo } from "react";
import { QUESTION_TYPES, type QuestionType } from "../../constant";

export function useShouldShowIndicator(
  showingCorrectAnswer: boolean,
  questionType: QuestionType,
  isAnswerCorrect: boolean,
  isSelected: boolean
): boolean {
  return useMemo(() => {
    if (!showingCorrectAnswer) return false;

    const shouldShowButtonIndicator =
      isAnswerCorrect && questionType === QUESTION_TYPES.BUTTON_SLIDE;
    const shouldShowCheckboxIndicator =
      isSelected && questionType === QUESTION_TYPES.CHECKBOX_SLIDE;

    return shouldShowButtonIndicator || shouldShowCheckboxIndicator;
  }, [showingCorrectAnswer, questionType, isAnswerCorrect, isSelected]);
}
