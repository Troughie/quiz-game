import type { Quiz } from "@/features/createQuiz/type";
import { get } from "@/libs/init.axios";
import type { ResponseBase } from "@/types/Index";
import { useQuery } from "@tanstack/react-query";
interface QuizzesProfile extends Quiz {
    slideCount: number;
}
export const fetchQuizzesOfUser = (): Promise<
    ResponseBase<QuizzesProfile[]>
> => {
    return get({ url: "/quiz/user/quizzes" });
};

export const useProfileGet = () => {
    const { data, isFetching } = useQuery({
        queryKey: ["user_quizzes"],
        queryFn: fetchQuizzesOfUser,
    });

    const quizzes = data?.data || [];
    return { quizzes, isFetching };
};
