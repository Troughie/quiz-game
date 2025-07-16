import type { ResponseBase } from "@/types/Index";
import { useQuery } from "@tanstack/react-query";
import type { Question } from "../type";
import { get } from "@/libs/init.axios";
import { useQuizStore } from "../store/quizStore";

export const fetchSlides = (key: {
    queryKey: [string, string, string];
}): Promise<ResponseBase<Question[]>> => {
    const quizId: string = key.queryKey[1];

    return get({ url: `quiz/${quizId}/slides` });
};

export const fetchSlide = (key: {
    queryKey: [string, number, string];
}): Promise<ResponseBase<Question>> => {
    const slideIndex: number = key.queryKey[1];
    const quizId: string = key.queryKey[2];
    return get({ url: `quiz/slide/${quizId}/${slideIndex}` });
};

export const useGetSlide = () => {
    const { currentSlideIndex, quiz } = useQuizStore();
    const { data } = useQuery({
        queryKey: ["slide", currentSlideIndex, quiz._id],
        queryFn: fetchSlide,
    });
    if (data) {
        const slide: Question = data?.data || {};

        return slide;
    }
    return {};
};

export const useGetSlides = (quizId: string) => {
    const { data, isFetching } = useQuery({
        queryKey: ["slides", quizId, "fetch"],
        queryFn: fetchSlides,
        enabled: !!quizId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 5 * 60 * 1000,
    });

    const slides: Question[] = data?.data || [];

    return { slides, isFetching };
};
