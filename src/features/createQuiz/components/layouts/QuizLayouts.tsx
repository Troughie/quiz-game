import React, { useEffect } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import SelectSlide from "../SelectSlide";
import { usePath } from "@/hooks/usePath";
import { useQuizStore } from "../../store/quizStore";
import { useNavigate } from "react-router";

interface props {
  children: React.ReactNode;
}

const MemoizedFooter = React.memo(Footer);
const MemoizedHeader = React.memo(Header);

const Layouts = ({ children = <SelectSlide /> }: props) => {
  const { pathname } = usePath();
  const { quiz, getSlide, currentSlideIndex, typeQuiz } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    const slide = getSlide();

    const shouldNavigate = pathname.includes("new") && quiz._id && slide?.type;

    if (!shouldNavigate) return;

    const newPath = pathname.replace("new", quiz._id);

    const timeout = setTimeout(() => {
      navigate(newPath + "/" + currentSlideIndex, {
        replace: true,
        state: {
          typeQuiz,
        },
      });
    }, 3400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, typeQuiz]);

  return (
    <div className="flex flex-col  bg-petrol justify-between min-h-screen max-w-screen">
      <MemoizedHeader />
      <div className="bg-petrol w-full h-full flex justify-center items-center my-20">
        {children}
      </div>
      <MemoizedFooter />
    </div>
  );
};

export default Layouts;
