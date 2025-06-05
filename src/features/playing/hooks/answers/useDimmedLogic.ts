import { useMemo } from "react";
import { QUESTION_TYPES, type QuestionType } from "../../constant";

export function useDimmedLogic(
  questionType: QuestionType,
  hasAnySelected: boolean,
  isSelected: boolean,
  isAnswerCorrect: boolean
): boolean {
  return useMemo(() => {
    if (questionType === QUESTION_TYPES.BUTTON_SLIDE) {
      return hasAnySelected && !isSelected;
    }
    if (questionType === QUESTION_TYPES.CHECKBOX_SLIDE) {
      return isAnswerCorrect && !isSelected;
    }
    return false;
  }, [questionType, hasAnySelected, isSelected, isAnswerCorrect]);
}
