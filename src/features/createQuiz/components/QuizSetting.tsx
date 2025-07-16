import React, { useEffect, useState } from "react";
import InputQuiz from "./ui/Input";
import type { Quiz } from "../type";
import useDebounce from "@/hooks/useDebounce";
import { useQuizFunction } from "../hooks/useQuizFunction";
import { useQuizStore } from "../store/quizStore";
import { getCleanQuiz } from "../utils";

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
    const { handleAChange, handleEditQuizApi, quiz, editQuiz } =
        useQuizFunction();
    const [input, setInput] = useState<{ [key: string]: string }>({});
    const debounceValue = useDebounce(input, 2400);
    const [quizCli, setQuizCli] = useState<Partial<Quiz>>();

    useEffect(() => {
        setQuizCli(quiz);
    }, [quiz]);

    useEffect(() => {
        if (Object.keys(debounceValue).length > 0) {
            const updatedQuiz = handleAChange<Quiz>(debounceValue);
            handleEditQuizApi(updatedQuiz);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue]);

    useEffect(() => {
        return () => {
            const quizChanged = useQuizStore.getState().quizChanged;
            const quiz = getCleanQuiz();
            if (quizChanged) {
                handleEditQuizApi(quiz);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeOptions = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        type: string
    ) => {
        setInput((prev) => {
            const updatedData = { ...prev, [type]: e.target.value };
            editQuiz(updatedData);
            return updatedData;
        });
    };

    return (
        <div className="flex gap-8 flex-col ">
            {itemInput.map(({ bg, border, name, title }) => (
                <InputQuiz
                    placeholder={title}
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
