import { slideFactory, type TypeQuizProps } from "@/features/createQuiz/type";

export const createSlide = <T extends keyof TypeQuizProps>(
  type: T
): TypeQuizProps[T] => {
  return slideFactory[type]() as TypeQuizProps[T];
};
