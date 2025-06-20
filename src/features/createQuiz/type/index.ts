import { BASE_ANSWERS } from "./constant";
import type { useQuizFunction } from "../hooks/useQuizFunction";

// === Shared Interfaces ===

export interface Quiz {
  _id: string;
  name: string;
  description: string;
  media: string;
  tags: string[];
  slides?: Question[] | Question;
}

export interface Answer {
  text?: string;
  isCorrect: boolean;
  image?: string;
}

export interface Question {
  type?: SlideType;
  _id?: string;
  question?: string;
  index: number;
  media?: string;
  funFact?: string;
  answers?: Answer[];
  unit?: string | number;
  correctValue?: number | string;
  exact?: boolean;
}

// === Type Definition for Slide Type ===

export type quizType = "selectType" | "settingQuiz" | SlideType;

export type SlideType = keyof TypeQuizProps;

export interface SlideTypeProp {
  type: SlideType;
  description: string;
  name: string;
}

export interface QuestionButton extends Question {
  type: "buttonSlide";
}

export interface QuestionCheckBox extends Question {
  type: "checkBoxSlide";
}
export interface QuestionFillBlank extends Question {
  type: "fillBlank";
}

export interface QuestionReorder extends Question {
  type: "reorderSlide";
}

export interface QuestionRange extends Question {
  type: "rangeSlide";
  unit?: string | number;
  correctValue: number | string;
  exact: boolean;
}

// === Type Mapping for Slide Quiz ===

export const slideFactory = {
  buttonSlide: (): QuestionButton => ({
    type: "buttonSlide",
    question: "",
    answers: [...BASE_ANSWERS],
    index: 0,
  }),
  checkBoxSlide: (): QuestionCheckBox => ({
    type: "checkBoxSlide",
    question: "",
    answers: [...BASE_ANSWERS],
    index: 0,
  }),
  reorderSlide: (): QuestionReorder => ({
    type: "reorderSlide",
    question: "",
    answers: [...BASE_ANSWERS],
    index: 0,
  }),
  fillBlank: () => ({
    type: "fillBlank",
    question: "",
    answers: [{ text: "", isCorrect: true }],
    index: 0,
  }),
  rangeSlide: (): QuestionRange => ({
    type: "rangeSlide",
    question: "",
    correctValue: "",
    exact: false,
    answers: [],
    index: 0,
  }),
};

export type ActionClient = "DELETE_ANSWER" | "UPDATE";

export const SLIDE_TYPES = {
  buttonSlide: true,
  checkBoxSlide: true,
  rangeSlide: true,
  reorderSlide: true,
  fillBlank: true,
  settingQuiz: false,
} as const;

export type TypeQuizProps = {
  buttonSlide: QuestionButton;
  checkBoxSlide: QuestionCheckBox;
  rangeSlide: QuestionRange;
  reorderSlide: QuestionReorder;
  fillBlank: QuestionFillBlank;
};
export type QuestionType =
  | QuestionButton
  | QuestionCheckBox
  | QuestionReorder
  | QuestionRange
  | QuestionFillBlank;

export interface BaseTypeUseQuizFunction {
  quizFunctions: ReturnType<typeof useQuizFunction>;
}
type slideMode = "answers" | "question" | "funFact" | "media";
type QuizMode = "name" | "description" | "media" | "tag";
export interface Options_change {
  value: string;
  index?: number;
  isCorrect?: boolean;
  mode: slideMode | QuizMode;
}

export interface slideProps {
  handleInputChange: ({
    value,
    index,
    isCorrect,
    mode,
  }: Options_change) => void;
  slide: Question;
}

export interface NavigationParams {
  type: NavigationType;
  slideIndex?: number;
  quizId?: string;
  replaceUrl?: boolean;
  delay?: number;
}

export enum NavigationType {
  QUIZ_SLIDE = "quiz_slide",
  SELECT_TYPE = "select_type",
  SETTING = "setting",
  REDIRECT_NEW_TO_ID = "redirect_new_to_id",
}
