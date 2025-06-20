import FormDynamic from "@/features/createQuiz/components/FormDynamic";
import Layouts from "@/features/createQuiz/components/layouts/QuizLayouts";
import SelectSlide from "@/features/createQuiz/components/SelectSlide";
import { VALID_TYPE } from "@/features/createQuiz/type/constant";
import { useQuizFunction } from "@/features/createQuiz/hooks/useQuizFunction";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";
import type { TypeQuizProps } from "@/features/createQuiz/type";
import { useMemo } from "react";

const CreateQuiz = () => {
  const typeQuiz = useQuizStore.getState().typeQuiz as keyof TypeQuizProps;
  const quizFunctions = useQuizFunction();

  // Memoize content để tránh re-render không cần thiết
  const quizContent = useMemo(() => {
    if (VALID_TYPE.includes(typeQuiz)) {
      return <FormDynamic QType={typeQuiz} quizFunctions={quizFunctions} />;
    }
    return <SelectSlide quizFunctions={quizFunctions} />;
  }, [typeQuiz, quizFunctions]);

  return <Layouts quizFunctions={quizFunctions}>{quizContent}</Layouts>;
};

export default CreateQuiz;
