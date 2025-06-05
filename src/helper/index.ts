import {
  slideFactory,
  type QuestionButton,
  type QuestionCheckBox,
  type QuestionType,
  type TypeQuizProps,
  type QuestionReorder,
} from "@/features/createQuiz/type";

export const hasWrongAnswers = (
  slide: QuestionType
): slide is QuestionButton => {
  return "wrongAnswers" in slide;
};

export const answersCheckbox = (
  slide: QuestionType
): slide is QuestionCheckBox => {
  return "answers" in slide;
};

export const answersReorder = (
  slide: QuestionType
): slide is QuestionReorder => {
  return "answers" in slide;
};

export const createSlide = <T extends keyof TypeQuizProps>(
  type: T
): TypeQuizProps[T] => {
  return slideFactory[type]() as TypeQuizProps[T];
};
