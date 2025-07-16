import Input from "@/components/ui/InputBase";
import { useEffect, useState } from "react";
import type { Answer, slideProps } from "../../type";
import { useQuizStore } from "../../store/quizStore";
import InputQuiz from "../ui/Input";
import { motion as m } from "framer-motion";
import cn from "@/HOC/cn";

interface checkBoxOrButtonSlideProps extends slideProps {
    QType: "checkBoxSlide" | "buttonSlide";
}

const MultiAndSingleSlideButton: {
    text: string;
    type: "buttonSlide" | "checkBoxSlide";
}[] = [
    {
        text: "Single choice",
        type: "buttonSlide",
    },
    {
        text: "Multiple choices",
        type: "checkBoxSlide",
    },
];
const MultiAndSingleSlide = ({
    handleInputChange,
    slide,
    QType,
}: checkBoxOrButtonSlideProps) => {
    const [answers, setAnswers] = useState<Answer[]>([]);
    useEffect(() => {
        setAnswers(slide?.answers || []);
    }, [slide]);

    const editCurrentSlide = useQuizStore.getState().editCurrentSlide;
    const setTypeQuiz = useQuizStore.getState().setTypeQuiz;

    const handleChangeIsCorrectAnswer = (index: number) => {
        let newAnswers: Answer[] = [...answers];
        if (QType === "checkBoxSlide") {
            newAnswers = answers?.map((answer, i) => {
                if (i === index) {
                    return { ...answer, isCorrect: !answer?.isCorrect };
                }
                return answer;
            });
        } else {
            if (answers[index].isCorrect) {
                return;
            }

            newAnswers = answers?.map((answer, i) => {
                return {
                    ...answer,
                    isCorrect: i === index,
                };
            });
        }

        setAnswers(newAnswers);
        handleInputChange({
            mode: "answers",
            value: newAnswers[index]?.text || "",
            index,
            isCorrect: newAnswers[index]?.isCorrect,
        });
    };

    const handleAddAnswer = () => {
        const newAnswer: Answer = {
            text: "",
            isCorrect: false,
        };
        setAnswers((prev) => {
            const updatedAnswer = [...prev, newAnswer];
            editCurrentSlide({
                type: "UPDATE",
                updates: { answers: updatedAnswer },
            });
            return updatedAnswer;
        });
    };

    const handleDeleteAnswer = (index: number) => {
        const newAnswers = answers.filter((_, i) => i !== index);
        setAnswers(newAnswers);
        editCurrentSlide({ type: "DELETE_ANSWER", index });
    };

    const handleChangeTypeSlide = (type: "checkBoxSlide" | "buttonSlide") => {
        if (QType === type) return;

        let foundFirstTrue = false;

        const newAnswers = answers.map((an) => {
            if (an.isCorrect) {
                if (!foundFirstTrue) {
                    foundFirstTrue = true;
                    return an;
                } else {
                    return { ...an, isCorrect: false };
                }
            }
            return an;
        });
        editCurrentSlide({
            type: "UPDATE",
            updates: {
                type: type,
                answers: type === "buttonSlide" ? newAnswers : answers,
            },
        });
        setTypeQuiz(type);
    };
    return (
        <>
            <div className="flex items-center font-semibold absolute gap-4 -top-14">
                {MultiAndSingleSlideButton.map((item, index) => {
                    const isActive = item.type === QType;
                    return (
                        <div className="relative" key={index}>
                            {isActive && (
                                <m.div
                                    layoutId="bg"
                                    className="absolute inset-0 -top-1 p-4 bg-black/90 rounded-lg z-0"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}

                            <span
                                onClick={() => handleChangeTypeSlide(item.type)}
                                className={cn(
                                    "rounded-lg relative p-2 cursor-pointer z-1  transition-all duration-300",
                                    isActive
                                        ? "text-white "
                                        : "text-black hover:text-white hover:-top-1 bg-white/30"
                                )}
                            >
                                {item.text}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className=" flex-col inline-flex rounded-xl">
                <Input
                    name="wrongAnswer"
                    render={(field) => (
                        <>
                            {answers?.map((answer, index) => {
                                return (
                                    <InputQuiz
                                        clickIcon={() =>
                                            handleChangeIsCorrectAnswer(index)
                                        }
                                        itemRef=""
                                        key={index}
                                        {...field}
                                        maxLength={120}
                                        row={1}
                                        showIcon={true}
                                        name={`wrongAnswers`} // Nếu bạn dùng react-hook-form
                                        isTrueIcon={answer?.isCorrect}
                                        value={answer?.text}
                                        onChange={(e) =>
                                            handleInputChange({
                                                value: e.target.value,
                                                index: index,
                                                mode: "answers",
                                            })
                                        }
                                        showDelete={answers.length > 2}
                                        clickDelete={() =>
                                            handleDeleteAnswer(index)
                                        }
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

export default MultiAndSingleSlide;
