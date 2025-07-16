import { useEffect, useState } from "react";
import { useQuizStore } from "../store/quizStore";
import useRequest from "@/hooks/useMutation";
import type { Answer, Options_change, Question, Quiz } from "../type";
import type { ResponseBase } from "@/types/Index";
import useDebounce from "@/hooks/useDebounce";
import { useQuizRequest } from "./useQuizRequest";

export const useQuizFunction = () => {
    const { editSlide, removeSlide, ...state } = useQuizStore();
    const {
        editQuiz,
        selectedSlide,
        editCurrentSlide,
        markAsSaved,
        quiz,
        resetQuizChanged,
        typeQuiz,
    } = state;
    const [input, setInput] = useState<{ [key: string]: string | Answer[] }>(
        {}
    );
    const debounceValue = useDebounce(input, 3000);

    const {
        createQuizAPI,
        createSlideAPI,
        deleteSlideAPI,
        editQuizAPI,
        editSlideAPI,
        uploadMediaApi,
    } = useQuizRequest();

    const { mutateAsync: createQuiz } = useRequest({
        mutationFn: createQuizAPI,
        onSuccess: (data: ResponseBase<Quiz>) => {
            sessionStorage.setItem("quizId", data.data._id);
            editQuiz(data.data);
            resetQuizChanged();
            console.log("created quiz success..");
        },

        showSuccess: false,
        showSwal: false,
    });

    const { mutateAsync: uploadMedia } = useRequest({
        mutationFn: uploadMediaApi,

        showSuccess: false,
        showSwal: false,
    });

    const { mutateAsync: editQuizApi } = useRequest({
        mutationFn: editQuizAPI,
        onSuccess: (data: ResponseBase<Quiz>) => {
            editQuiz(data.data);
            resetQuizChanged();
            console.log("Edit quiz success..");
        },

        showSuccess: false,
        showSwal: false,
    });

    const { mutateAsync: deleteSlide } = useRequest({
        mutationFn: deleteSlideAPI,

        showSuccess: false,
        showSwal: false,
    });

    const { mutateAsync: createSlideServer } = useRequest({
        mutationFn: createSlideAPI,
        onSuccess: (data: ResponseBase<Question>) => {
            console.log("created slide success..");
            const slideEdited = data.data;

            editSlide(
                { type: "UPDATE", updates: slideEdited },
                slideEdited.index
            );
            markAsSaved();
            restoreValueFunc();
        },
        onError: (err) => {
            console.error("Some thing wrong!! " + err);
        },
        showSuccess: false,
        showSwal: false,
    });

    const { mutateAsync: editSlideServer } = useRequest({
        mutationFn: editSlideAPI,
        onSuccess: (data: ResponseBase<Question>) => {
            markAsSaved();
            const slideEdited = data.data;

            editSlide(
                { type: "UPDATE", updates: slideEdited },
                slideEdited._id
            );
            restoreValueFunc();
            console.log("edit slide success...");
        },
        onError: (err) => {
            console.error("Some thing wrong!! " + err);
        },
        showSuccess: false,
        showSwal: false,
    });

    const handleEditQuizApi = async (value: Partial<Quiz>) => {
        if (!quiz._id) {
            console.log("1--Creating quiz before editing quiz...");

            // Đợi quiz được tạo xong trước khi tiếp tục
            await handleCreateQuiz();
        }
        editQuizApi(value);
    };

    const restoreValueFunc = () => {
        setInput({});
    };

    const handleDeleteSlide = (slideId: string) => {
        deleteSlide(slideId);
        removeSlide(slideId);
    };

    const handleCreateQuiz = async () => {
        return await createQuiz({});
    };

    const handleEditSlide = async (
        slide: Partial<Question> | Question | null
    ) => {
        if (slide === null) return;

        if (!quiz._id) {
            console.log("2---Creating quiz before editing slide...");

            // Đợi quiz được tạo xong trước khi tiếp tục
            await handleCreateQuiz();

            // Lấy quiz mới sau khi tạo xong
        }

        if (!slide._id) {
            console.log("Create new slide...");
            await createSlideServer(slide);
        } else {
            console.log("Edit existing slide...");
            await editSlideServer(slide);
        }
    };

    const handleAChange = <T>(
        debounceValue: { [key: string]: string | Answer[] },
        answers?: unknown[]
    ): Partial<T> => {
        const updatedSlide: Partial<T> = {};

        Object.keys(debounceValue).forEach((key) => {
            if (key !== "answers") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updatedSlide[key as keyof T] = debounceValue[key] as any;
            }
        });

        if (answers && answers.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (updatedSlide as any).answers = [...answers];
        }

        return updatedSlide;
    };

    useEffect(() => {
        if (Object.keys(debounceValue).length > 0) {
            if (!selectedSlide) return;

            const newSlide: Partial<Question> = {
                ...debounceValue,
                index: selectedSlide.index,
                type: selectedSlide.type,
                _id: selectedSlide._id,
            };

            handleEditSlide(newSlide);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue]);

    const handleAnswerChange = (
        currentAnswers: Answer[],
        index: number,
        value: string,
        isCorrect?: boolean
    ) => {
        // Tạo bản copy của array để tránh mutation
        const newAnswers = [...currentAnswers];

        switch (typeQuiz) {
            case "checkBoxSlide":
                newAnswers[index] = {
                    ...newAnswers[index],
                    text: value,
                    isCorrect:
                        isCorrect !== undefined
                            ? isCorrect
                            : newAnswers[index].isCorrect,
                };
                break;

            case "buttonSlide":
                if (isCorrect !== undefined) {
                    // Với buttonSlide, chỉ một câu trả lời có thể đúng
                    return newAnswers.map((answer, i) => ({
                        ...answer,
                        text: i === index ? value : answer.text,
                        isCorrect: i === index ? isCorrect : false,
                    }));
                } else {
                    // Chỉ cập nhật text nếu không có isCorrect
                    newAnswers[index] = {
                        ...newAnswers[index],
                        text: value,
                    };
                }
                break;
            default:
                newAnswers[index] = {
                    ...newAnswers[index],
                    text: value,
                    isCorrect: isCorrect ?? false,
                };
                break;
        }

        return newAnswers;
    };

    const handleInputChange = ({
        value,
        index,
        isCorrect,
        mode,
    }: Options_change) => {
        setInput((prev) => {
            let updated = { ...prev, [mode]: value };
            if (
                mode === "answers" &&
                index !== undefined &&
                selectedSlide?.answers
            ) {
                const currentAnswers = [...selectedSlide.answers];
                const updateAnswers = handleAnswerChange(
                    currentAnswers,
                    index,
                    value,
                    isCorrect
                );
                updated = { ...updated, answers: updateAnswers };
            }
            editCurrentSlide({ type: "UPDATE", updates: updated });
            return updated;
        });
    };

    return {
        handleInputChange,
        handleEditSlide,
        handleAChange,
        handleDeleteSlide,
        handleCreateQuiz,
        handleEditQuizApi,
        uploadMedia,
        ...state,
    };
};
