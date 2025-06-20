import { SLIDE_TYPES, type Answer } from ".";

export const VALID_TYPE = Object.keys(SLIDE_TYPES) as Array<
  keyof typeof SLIDE_TYPES
>;

export const VALID_TYPE_CREATE = VALID_TYPE.filter((type) => SLIDE_TYPES[type]);
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
