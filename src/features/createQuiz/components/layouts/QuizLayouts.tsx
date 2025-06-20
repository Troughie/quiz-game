import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { usePath } from "@/hooks/usePath";
import { useQuizRequest } from "@/features/createQuiz/hooks/useQuizRequest";
import {
  NavigationType,
  type BaseTypeUseQuizFunction,
  type Question,
} from "../../type";
import type { ResponseBase } from "@/types/Index";
import { useHandleNavigation } from "../../hooks/useNavigate";
import { useQuizStore } from "../../store/quizStore";

interface props extends BaseTypeUseQuizFunction {
  children: React.ReactNode;
}

const MemoizedFooter = React.memo(Footer);
const MemoizedHeader = React.memo(Header);

const Layouts = ({ children, quizFunctions }: props) => {
  const { pathname } = usePath();
  const { id, num } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { quiz, selectSlide, setTypeQuiz, selectedSlide, addSlides } =
    quizFunctions;
  const handleNavigation = useHandleNavigation();

  const { loadQuizById } = useQuizRequest();

  // Handle navigation for new quiz creation
  useEffect(() => {
    const shouldNavigate = pathname.includes("new") && quiz._id;

    if (!shouldNavigate) return;
    setIsRedirecting(true);

    const slideIndex = useQuizStore.getState().currentSlideIndex;

    handleNavigation({
      type: NavigationType.REDIRECT_NEW_TO_ID,
      quizId: quiz._id,
      delay: 3000,
      slideIndex,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, quiz]);

  // Handle URL validation and quiz loading
  useEffect(() => {
    const validateAndLoadQuiz = async () => {
      if (isRedirecting) return;
      setLoading(true);
      // Handle "new" quiz creation case
      if (id === "new") {
        setLoading(false);
        return;
      }

      // Handle existing quiz editing case
      if (!id) {
        setLoading(true);
        return;
      }

      // Load quiz by ID
      const quizResponse = (await loadQuizById(id)) as ResponseBase<Question[]>;
      if (!quizResponse.data || !quizResponse.success) {
        setLoading(true);
        return;
      }
      const slides = quizResponse.data;

      // Validate slide index
      const currentSlideIndex = num ? parseInt(num) : 0;

      if (isNaN(currentSlideIndex) || currentSlideIndex < 0) {
        console.log("slide index isValid!");
        // Invalid slide index, redirect to first slide
        navigate(`/edit/${id}/0`, { replace: true });
        return;
      }

      // Check if slide exists
      const lastSlideIndex = Math.max(0, slides.length - 1);
      if (currentSlideIndex >= slides.length) {
        // Slide index out of range, redirect to last slide
        navigate(`/edit/${id}/${lastSlideIndex}`);
      }

      const currentSlide = slides[lastSlideIndex];
      if (currentSlide && currentSlide.type !== undefined && !selectedSlide) {
        addSlides(slides);
        selectSlide(lastSlideIndex);
        setTypeQuiz(currentSlide.type);
      }
      setLoading(false);
    };

    validateAndLoadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isRedirecting]);

  const LoadingComponent = () => (
    <div className="fixed inset-1 flex justify-center items-center bg-white bg-opacity-75 z-10">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading quiz...</span>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col bg-petrol justify-between min-h-screen max-w-screen">
      <MemoizedHeader />
      <div className="bg-petrol w-full h-full flex justify-center items-center">
        {children}
      </div>
      <MemoizedFooter quizFunctions={quizFunctions} />
      {loading && <LoadingComponent />}
    </div>
  );
};

export default Layouts;
