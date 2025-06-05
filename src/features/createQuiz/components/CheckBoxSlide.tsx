import React, { useState } from "react";
import InputQuiz from "./ui/Input";
import cn from "@/HOC/cn";
import Input from "@/components/ui/InputBase";
import type { slideProps } from "./ButtonSlide";
import type { Answer } from "../type";

const CheckBoxSlide = ({ handleAnswerChange, slide }: slideProps) => {
  const [answers, setAnswers] = useState<Answer[]>(slide?.answers || []);

  const handleClick = (index: number) => {
    setAnswers((prev) =>
      prev.map((pre, i) => {
        if (i === index) {
          return { ...pre, isCorrect: !pre?.isCorrect };
        }
        return pre;
      })
    );
  };

  return (
    <>
      <div className=" flex-col inline-flex bg-emerald-900  rounded-b-xl mt-4">
        <Input
          name="wrongAnswer"
          render={(field) => (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => {
                return (
                  <InputQuiz
                    clickIcon={() => handleClick(index)}
                    onChange={(e) =>
                      handleAnswerChange({
                        value: e.target.value,
                        index,
                        mode: "answers",
                        isCorrect: answers[index]?.isCorrect,
                        slideIdProp: slide?._id || "",
                      })
                    }
                    key={index}
                    {...field}
                    maxLength={120}
                    row={1}
                    showIcon={true}
                    value={slide?.answers?.[index]?.text || ""}
                    isTrueIcon={
                      slide?.answers?.[index]?.isCorrect ||
                      answers?.[index]?.isCorrect
                    }
                    title={cn("", index === 0 && "Wrong answer")}
                    name={`wrongAnswers`} // Nếu bạn dùng react-hook-form
                    backgroundColor="bg-emerald-900"
                    borderColor="border-emerald-900 rounded-xl"
                    classNameContainer={`${index === 0 && "-mt-4"}`}
                  />
                );
              })}
            </div>
          )}
        />
      </div>
    </>
  );
};

export default CheckBoxSlide;
