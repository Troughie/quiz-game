import * as yup from "yup";
import { BASE_ANSWERS } from "../constant";

// === Shared Interfaces ===

export interface Quiz {
  _id: string;
  name: string;
  description: string;
  media: string;
  tags: string[];
  slides?: Question[];
}

export interface Answer {
  text: string;
  isCorrect: boolean;
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

export interface QuizProp {
  typeQuiz: quizType;
}

// === Specific Slide Question Types ===

export interface SlideProps {
  QType?: keyof TypeQuizProps;
}

export interface QuestionButton extends Question {
  type: "buttonSlide";
}

export interface QuestionCheckBox extends Question {
  type: "checkBoxSlide";
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

export type TypeQuizProps = {
  buttonSlide: QuestionButton;
  checkBoxSlide: QuestionCheckBox;
  rangeSlide: QuestionRange;
  reorderSlide: QuestionReorder;
};

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
  rangeSlide: (): QuestionRange => ({
    type: "rangeSlide",
    question: "",
    correctValue: "",
    exact: false,
    answers: [],
    index: 0,
  }),
};

export type GetSlideByType<T extends keyof TypeQuizProps> = TypeQuizProps[T];
export type QuestionType =
  | QuestionButton
  | QuestionCheckBox
  | QuestionReorder
  | QuestionRange;

export type ModeSlide = "edit" | "create";
// === Example Schema for Button Slide ===

export const ButtonSchema = yup.object().shape({
  question: yup.string().required("Question is required"),
  correctAnswer: yup.string().required("Correct answer is required"),
  wrongAnswers: yup
    .array()
    .of(yup.string().required("Wrong answer cannot be empty"))
    .min(1, "At least one wrong answer is required"),
});
