import { useEffect, useState } from "react";
import { useQuizStore } from "../store/quizStore";
import useRequest from "@/hooks/useMutation";
import { del, post, put } from "@/libs/init.axios";
import type { Answer, Question, Quiz } from "../type";
import { BASE_ANSWERS } from "../constant";
import type { ResponseBase } from "@/types/Index";

import useDebounce from "@/hooks/useDebounce";
type Mode = "answers" | "question" | "funFact" | "media";
export interface Options_change {
  value: string;
  index?: number;
  isCorrect?: boolean;
  mode: Mode;
  slideIdProp: string;
}

export const useQuizFunction = () => {
  const {
    editSlides,
    editQuiz,
    getSlide,
    setSlideChanged,
    slideId,
    setSlideId,
    isChanged,
    setIndexAnswer,
    removeSlide,
  } = useQuizStore();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [input, setInput] = useState<{ [key: string]: string }>({});
  const debounceValue = useDebounce(input, 2400);

  const { mutate: createQuiz } = useRequest({
    mutationFn: () => {
      return post({ url: "quiz/create" });
    },
    onSuccess: (data: ResponseBase<Quiz>) => {
      const slide: Question = {
        type: getSlide()?.type,
        index: 0,
        answers: [...BASE_ANSWERS],
      };
      createSlide(slide);
      sessionStorage.setItem("quizId", data.data._id);
      editQuiz(data.data);
      console.log("created quiz success..");
    },

    showSuccess: false,
    showSwal: false,
  });

  const { mutate: editQuizApi } = useRequest({
    mutationFn: (value: Partial<Quiz>) => {
      const quizId = sessionStorage.getItem("quizId");
      return put({ url: `quiz/${quizId}`, data: { quiz: value } });
    },
    onSuccess: (data: ResponseBase<Quiz>) => {
      editQuiz(data.data);
      console.log("Edit quiz success..");
    },

    showSuccess: false,
    showSwal: false,
  });

  const handleEditQuizApi = (value: Partial<Quiz>) => {
    editQuizApi(value);
  };

  const { mutate: deleteSlide } = useRequest({
    mutationFn: (slideId: string) => {
      const quizId = sessionStorage.getItem("quizId");
      return del({ url: `quiz/${quizId}/${slideId}` });
    },

    showSuccess: false,
    showSwal: false,
  });

  const { mutate: createSlide } = useRequest({
    mutationFn: (value: Question) => {
      return post({
        url: `quiz/slide`,
        data: {
          slide: value,
          quizId: sessionStorage.getItem("quizId"),
        },
      });
    },
    onSuccess: (data: ResponseBase<Question>) => {
      console.log("created slide success..");
      setSlideChanged(undefined);
      restoreValueFunc();
      editSlides(data?.data, data?.data.index);
    },
    onError: (err) => {
      console.error("Some thing wrong!! " + err);
    },
    showSuccess: false,
    showSwal: false,
  });

  const restoreValueFunc = () => {
    setAnswers([]);
    setInput({});
    setIndexAnswer(undefined);
  };

  const { mutate: editSlideApi } = useRequest({
    mutationFn: (value: Question) => {
      return put({
        url: `quiz/slide`,
        data: {
          slide: value,
          slideId: slideId,
        },
      });
    },
    onSuccess: (data: ResponseBase<Question>) => {
      const updatedSlide = data.data;
      setSlideChanged(undefined);
      setSlideId(undefined);
      editSlides(updatedSlide, updatedSlide?._id);

      restoreValueFunc();

      console.log("edit slide success...");
    },
    onError: (err) => {
      console.error("Some thing wrong!! " + err);
    },
    showSuccess: false,
    showSwal: false,
  });

  const handleCreateQuiz = () => {
    createQuiz({});
  };

  const handleDeleteSlide = (slideId: string) => {
    deleteSlide(slideId);
    removeSlide(slideId);
  };

  const handleCreateSlide = (slide: Partial<Question>) => {
    setTimeout(() => {
      createSlide(slide as Question);
    }, 2000);
  };

  const handleEditSlide = (slide: Partial<Question>) => {
    if (!getSlide()._id) {
      slide.type = getSlide()?.type;
      createSlide(slide as Question);
    } else {
      console.log("Start edit slide.........");
      editSlideApi(slide);
    }
  };

  const handleInputChange = <T>(
    debounceValue: { [key: string]: string },
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
    if (Object.keys(debounceValue).length > 0 && !isChanged) {
      console.log("3");
      const updatedSlide = handleInputChange<Question>(debounceValue, answers);
      restoreValueFunc();
      handleEditSlide(updatedSlide);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  const handleAnswerChange = ({
    value,
    index,
    isCorrect,
    mode,
    slideIdProp,
  }: Options_change) => {
    setInput((prev) => {
      const updated = { ...prev, [mode]: value };

      return updated;
    });
    setIndexAnswer(index);
    if (mode === "answers" && index !== undefined && isCorrect !== undefined) {
      // Tạo bản sao của mảng answers hiện tại
      const updatedAnswers = [...answers];

      // Đảm bảo mảng đủ dài để chứa index cần cập nhật
      while (updatedAnswers.length <= index) {
        updatedAnswers.push({} as Answer);
      }

      // Cập nhật câu trả lời tại index
      updatedAnswers[index] = {
        ...updatedAnswers[index],
        text: value,
        isCorrect: isCorrect,
      };

      setAnswers(updatedAnswers);
    }
    setSlideId(slideIdProp);
  };

  return {
    handleAnswerChange,
    handleCreateQuiz,
    handleCreateSlide,
    handleEditSlide,
    handleInputChange,
    handleDeleteSlide,
    handleEditQuizApi,
  };
};
