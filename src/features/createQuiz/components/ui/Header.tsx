import Button from "@/components/ui/ButtonCustom";
import { useNavigate } from "react-router";
import { useQuizStore } from "../../store/quizStore";
import type { BaseTypeUseQuizFunction } from "../../type";
import { getCleanQuiz } from "../../utils";

const Header = ({ quizFunctions }: BaseTypeUseQuizFunction) => {
    const { handleEditSlide, handleEditQuizApi } = quizFunctions;
    const navigate = useNavigate();
    const handleDoneCreateQuiz = () => {
        navigate("/", { replace: true });
        return () => {
            const { selectedSlideChanged } = useQuizStore.getState();
            if (selectedSlideChanged) {
                handleEditSlide(selectedSlideChanged);
            }
            const quizChanged = useQuizStore.getState().quizChanged;
            const quiz = getCleanQuiz();
            if (quizChanged) {
                handleEditQuizApi(quiz);
            }
        };
    };
    return (
        <div className="flex gap-4 sticky top-0 z-10 w-full py-6 bg-petrol shadow-md shadow-black">
            <div className="w-30 h-10"></div>
            <Button
                text="Done"
                classContainer="w-20"
                onClick={handleDoneCreateQuiz}
            />
            <Button text="Preview" classContainer="w-20" />
        </div>
    );
};

export default Header;
