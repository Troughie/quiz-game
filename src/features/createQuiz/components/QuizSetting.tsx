import React, { useEffect, useState } from "react";
import InputQuiz from "./ui/Input";
import { useQuizStore } from "../store/quizStore";
import type { Quiz } from "../type";
import useDebounce from "@/hooks/useDebounce";
import { useQuizFunction } from "../functional/functional";

const itemInput = [
  {
    name: "name",
    title: "Name",
    bg: "",
    border: "",
  },
  {
    name: "description",
    title: "Description",
    bg: "bg-petrol",
    border: "border-petrol",
  },
  {
    name: "tags",
    title: "Tags",
    bg: "bg-black",
    border: "border-black",
  },
];
const QuizSetting = () => {
  const { quiz } = useQuizStore();
  const { handleInputChange, handleEditQuizApi } = useQuizFunction();
  const [input, setInput] = useState<{ [key: string]: string }>({});
  const debounceValue = useDebounce(input, 2400);
  const [quizCli, setQuizCli] = useState<Partial<Quiz>>();

  useEffect(() => {
    setQuizCli(quiz);
  }, [quiz]);

  useEffect(() => {
    if (Object.keys(debounceValue).length > 0) {
      const updatedQuiz = handleInputChange<Quiz>(debounceValue);

      handleEditQuizApi(updatedQuiz);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  const handleChangeOptions = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    type: string
  ) => {
    setInput((prev) => ({ ...prev, [type]: e.target.value }));
  };
  return (
    <div className="flex gap-8 flex-col ">
      {itemInput.map(({ bg, border, name, title }) => (
        <InputQuiz
          key={name}
          name={name}
          title={title}
          backgroundColor={bg}
          borderColor={border}
          maxLength={120}
          value={(quizCli as Record<string, string>)?.[name] || ""}
          onChange={(e) => handleChangeOptions(e, name)}
        />
      ))}
    </div>
  );
};

export default QuizSetting;
