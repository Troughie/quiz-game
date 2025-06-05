import SelectSlide from "./components/SelectSlide";
import type { Answer } from "./type";

export const QUIZ_TYPE = {
  selectType: SelectSlide,
};

export const VALID_TYPE = [
  "buttonSlide",
  "checkBoxSlide",
  "rangeSlide",
  "reorderSlide",
  "settingQuiz",
];

export const TYPE_QUESTION = {
  buttonSlide: "buttonSlide",
  checkBoxSlide: "checkBoxSlide",
  rangeSlide: "rangeSlide",
  reorderSlide: "reorderSlide",
  settingQuiz: "settingQuiz",
};

export const VALID_TYPE_CREATE = VALID_TYPE.filter(
  (type) => type !== "settingQuiz"
);

export const BASE_ANSWERS: Answer[] = [
  {
    text: "",
    isCorrect: true,
  },
  {
    text: "",
    isCorrect: false,
  },
  {
    text: "",
    isCorrect: false,
  },
  {
    text: "",
    isCorrect: false,
  },
];
