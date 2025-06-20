import Input from "@/components/ui/InputBase";
import { useEffect, useState } from "react";
import type { Answer, slideProps } from "../../type";
import { useQuizStore } from "../../store/quizStore";
import InputQuiz from "../ui/Input";

const FillBankSlide = ({ handleInputChange, slide }: slideProps) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  useEffect(() => {
    setAnswers(slide?.answers || []);
  }, [slide]);

  const editCurrentSlide = useQuizStore.getState().editCurrentSlide;

  const handleAddAnswer = () => {
    const newAnswer: Answer = {
      text: "",
      isCorrect: true,
    };
    setAnswers((prev) => {
      const updatedAnswer = [...prev, newAnswer];
      editCurrentSlide({ type: "UPDATE", updates: { answers: updatedAnswer } });
      return updatedAnswer;
    });
  };

  const handleDeleteAnswer = (index: number) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
    editCurrentSlide({ type: "DELETE_ANSWER", index });
  };
  return (
    <>
      <div className=" flex-col inline-flex rounded-xl mt-4">
        <Input
          name="wrongAnswer"
          render={(field) => (
            <>
              {answers?.map((answer, index) => {
                return (
                  <InputQuiz
                    itemRef=""
                    key={index}
                    {...field}
                    maxLength={120}
                    row={1}
                    name={`fillBlankAnswer-${index}`}
                    value={answer?.text}
                    onChange={(e) =>
                      handleInputChange({
                        value: e.target.value,
                        index: index,
                        mode: "answers",
                      })
                    }
                    showDelete={answers.length > 1}
                    clickDelete={() => handleDeleteAnswer(index)}
                  />
                );
              })}
            </>
          )}
        />
        {answers.length < 5 && (
          <span
            onClick={handleAddAnswer}
            className="text-center font-semibold text-white cursor-pointer mt-1 hover:scale-110 duration-300 transition-all"
          >
            Add more answers...
          </span>
        )}
      </div>
    </>
  );
};

export default FillBankSlide;
