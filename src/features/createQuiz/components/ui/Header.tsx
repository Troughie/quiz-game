import Button from "@/components/ui/ButtonCustom";
import { useQuizStore } from "../../store/quizStore";
import useRequest from "@/hooks/useMutation";
import { post } from "@/libs/init.axios";
import type { QuestionType, Quiz } from "../../type";

interface quizQuestion {
  quiz: Quiz;
  slides: QuestionType;
}
const Header = () => {
  const { quiz } = useQuizStore();
  const { mutate: createQuiz } = useRequest({
    mutationFn: ({ quiz, slides }: quizQuestion) => {
      return post({ url: "/quiz/create", data: { quiz, slides } });
    },
  });

  const handleClickCreateQuiz = () => {
    createQuiz(quiz);
  };
  return (
    <div className="flex gap-4 sticky top-0 z-10 w-full py-6 bg-petrol shadow-md shadow-black">
      <div className="w-30 h-10"></div>
      <Button
        text="Done"
        classContainer="w-20"
        onClick={handleClickCreateQuiz}
      />
      <Button text="Preview" classContainer="w-20" />
    </div>
  );
};

export default Header;
