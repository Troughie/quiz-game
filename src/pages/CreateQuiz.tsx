import FormDynamic from "@/features/createQuiz/components/FormDynamic";
import Layouts from "@/features/createQuiz/components/layouts/QuizLayouts";
import SelectSlide from "@/features/createQuiz/components/SelectSlide";
import { VALID_TYPE } from "@/features/createQuiz/constant";
import type { TypeQuizProps } from "@/features/createQuiz/type";
import { useLocation } from "react-router";

const CreateQuiz = () => {
  const { state } = useLocation();
  type typeForm = keyof TypeQuizProps;
  const typeQuiz = state?.typeQuiz as typeForm;
  return (
    <>
      <Layouts>
        {VALID_TYPE.includes(typeQuiz) ? (
          <FormDynamic QType={typeQuiz} />
        ) : (
          <>
            <SelectSlide />
          </>
        )}
      </Layouts>
    </>
  );
};

export default CreateQuiz;
