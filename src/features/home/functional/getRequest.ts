import type { Quiz } from "@/features/createQuiz/type";
import { get } from "@/libs/init.axios";
import type { ResponseBase } from "@/types/Index";
import { useQuery } from "@tanstack/react-query";

export interface QuizzesProps {
    myQuiz: Quiz[];
    recentlyPublished: Quiz[];
}
const fetchHomeQuizzes = (): Promise<ResponseBase<QuizzesProps>> => {
    return get({ url: "/home" });
};
export const useHomeFunction = () => {
    const { data } = useQuery({
        queryKey: ["home"],
        queryFn: fetchHomeQuizzes,
    });

    return { quizzes: data?.data || { myQuiz: [], recentlyPublished: [] } };
};
