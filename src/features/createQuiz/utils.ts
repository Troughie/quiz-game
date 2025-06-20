import type { Question } from "./type";

export const updateSlideAnswers = (
  currentSlide: Question,
  updates: Partial<Question>
) => {
  const updatedSlide = { ...currentSlide, ...updates };

  if (updates.answers && Array.isArray(updates.answers)) {
    updatedSlide.answers = updates.answers.map((answerUpdate, index) => {
      const existingAnswer = currentSlide.answers?.[index];
      if (!answerUpdate) {
        return existingAnswer || { text: "", isCorrect: false };
      }
      return { ...existingAnswer, ...answerUpdate };
    });
  }

  return updatedSlide;
};

export const deleteSlideAnswer = (
  currentSlide: Question,
  answerIndex: number
) => {
  return {
    ...currentSlide,
    answers:
      currentSlide.answers?.filter((_, index) => index !== answerIndex) || [],
  };
};

export type UpdateAction =
  | { type: "UPDATE"; updates: Partial<Question> }
  | { type: "DELETE_ANSWER"; index: number };

export const applySlideAction = (
  currentSlide: Question,
  action: UpdateAction
) => {
  switch (action.type) {
    case "UPDATE":
      return updateSlideAnswers(currentSlide, action.updates);

    case "DELETE_ANSWER":
      return deleteSlideAnswer(currentSlide, action.index);

    default:
      return currentSlide;
  }
};
