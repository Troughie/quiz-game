import InputQuiz from "./ui/Input";
import Input from "@/components/ui/InputBase";
import cn from "@/HOC/cn";
import type { Question } from "../type";
import type { Options_change } from "../functional/functional";

export interface slideProps {
  handleAnswerChange: ({
    value,
    index,
    isCorrect,
    mode,
  }: Options_change) => void;
  slide: Question;
}
const ButtonSlide = ({ handleAnswerChange, slide }: slideProps) => {
  return (
    <>
      <InputQuiz
        maxLength={120}
        row={1}
        title="Correct answer"
        name="correctAnswer"
        backgroundColor="bg-green-600"
        borderColor="border-green-600"
        value={slide?.answers?.find((e) => e?.isCorrect)?.text || ""}
        onChange={(e) =>
          handleAnswerChange({
            value: e.target.value,
            index: 0,
            mode: "answers",
            isCorrect: true,
            slideIdProp: slide?._id || "",
          })
        }
      />

      <div className=" flex-col inline-flex bg-red-500 rounded-b-xl mt-4">
        <Input
          name="wrongAnswer"
          render={(field) => (
            <>
              {Array.from({ length: 3 }).map((_, index) => {
                return (
                  <InputQuiz
                    itemRef=""
                    key={index}
                    {...field}
                    maxLength={120}
                    row={1}
                    title={cn("", index === 0 && "Wrong answer")}
                    name={`wrongAnswers`} // Nếu bạn dùng react-hook-form
                    backgroundColor="bg-red-500"
                    borderColor="border-red-500 rounded-xl"
                    classNameContainer={`${index === 0 && "-mt-4"}`}
                    value={
                      slide?.answers?.filter((e) => !e?.isCorrect)?.[index]
                        ?.text || ""
                    }
                    onChange={(e) =>
                      handleAnswerChange({
                        value: e.target.value,
                        index: index + 1,
                        mode: "answers",
                        isCorrect: false,
                        slideIdProp: slide?._id || "",
                      })
                    }
                  />
                );
              })}
            </>
          )}
        />
      </div>
    </>
  );
};

export default ButtonSlide;
