import Card from "@/components/layouts/Card";
import NavHome from "@/components/layouts/NavHome";
import Slider from "@/components/layouts/Slider";
import Button from "@/components/ui/ButtonCustom";
import { useQuizStore } from "@/features/createQuiz/store/quizStore";
import { useHomeFunction } from "@/features/home/functional/getRequest";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { useNavigate } from "react-router";

const Home = () => {
  const { reset, setTypeQuiz } = useQuizStore();
  const navigate = useNavigate();
  const { remove } = useSessionStorage<string | null>("quizId", null);
  const { quizzes } = useHomeFunction();
  const handleEditQuiz = () => {
    reset();
    setTypeQuiz("selectType");
    navigate("/edit/new");
    sessionStorage.removeItem("quiz_created");
    remove();
  };

  return (
    <div className="flex flex-col gap-16">
      <NavHome />
      <div>
        <div className="w-full bg-black/10 rounded-3xl h-40 flex flex-col justify-center items-center gap-4">
          <h1 className="text-3xl font-bold">Create a quiz</h1>
          <Button
            text="Quiz editor"
            classBg="bg-green-500 rounded-3xl"
            classContainer="border-4 rounded-3xl w-1/3 md:w-1/4 bg-green-600 h-1/4 md:h-2/6"
            classShadow="bg-black/10 rounded-3xl"
            classText="text-xs md:text-sm"
            onClick={handleEditQuiz}
          />
        </div>
      </div>
      {Object.entries(quizzes).map(([key, quiz]) => {
        return <Slider title={key} data={quiz} Component={Card} />;
      })}
    </div>
  );
};

export default Home;
