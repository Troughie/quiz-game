import { useQuizStore } from "../../store/quizStore";
import SlideFooterPreview from "./SlideFooterPreview";
import { useDynamicNavigate } from "@/hooks/useNavigateState";
import type { Question, QuizProp, quizType } from "../../type";
import { useQuizFunction } from "../../functional/functional";
import { usePath } from "@/hooks/usePath";
import { useGetSlides } from "../../functional/getRequest";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/ButtonCustom";

const Footer = () => {
  const {
    slides,
    setCurrentSlideIndex,
    quiz,
    addSlides,
    currentSlideIndex,
    setTypeQuiz,
  } = useQuizStore();
  const navigate = useDynamicNavigate<QuizProp>();
  const { handleCreateQuiz } = useQuizFunction();
  const { path, pathExcludeNum } = usePath();

  const quizId = useMemo(() => sessionStorage.getItem("quizId") || "", []);
  const { slides: slidesApi, isFetching } = useGetSlides(quizId);

  const [slidesCli, setSlidesCli] = useState<Question[]>();

  useEffect(() => {
    setSlidesCli(slides);
  }, [slides]);

  useEffect(() => {
    const slideIndex = sessionStorage.getItem("slideIndex");

    if (!isFetching) {
      if (slides.length === 0 && slidesApi.length > 0) {
        if (slideIndex && !currentSlideIndex) {
          setCurrentSlideIndex(parseInt(slideIndex));
        }
        setSlidesCli(slidesApi);
        addSlides(slidesApi);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const handleClickSlides = (index: number, type: quizType | undefined) => {
    if (type) {
      sessionStorage.setItem("slideIndex", index.toString());
      setTypeQuiz(type);
      setCurrentSlideIndex(index);
      if (quiz._id) {
        navigate("/edit/" + quiz._id + "/" + index, { typeQuiz: type });
      } else {
        navigate(pathExcludeNum + "/" + index, { typeQuiz: type });
      }
    }
  };

  const isActive = (index: number) => {
    if (path && Number.isNaN(parseInt(path))) {
      return index === 0;
    }
    return index === parseInt(path || "0");
  };

  const handleClickAddSlide = () => {
    const quizId = sessionStorage.getItem("quizId");
    setTypeQuiz("selectType");
    if (!quizId && !quiz?._id) {
      sessionStorage.setItem("quiz_created", "true");
      handleCreateQuiz();
    }
    navigate(pathExcludeNum, { typeQuiz: "selectType" });
  };

  const handleClickSetting = () => {
    setTypeQuiz("settingQuiz");
    navigate(pathExcludeNum, { typeQuiz: "settingQuiz" });
  };

  return (
    <div className="flex gap-4 sticky bottom-0 z-1 inset-shadow-black-10 shadow-2xl justify-between items-center w-full py-6 px-6 bg-petrol shadow-black">
      <Button
        text="Setting"
        variant="secondary"
        onClick={handleClickSetting}
      ></Button>
      <ul className="flex gap-2 self-center w-full items-center overflow-x-auto overflow-y-hidden whitespace-nowrap max-w-full min-w-[300px] px-2">
        {slidesCli?.map((slide, index) => {
          return (
            <SlideFooterPreview
              key={index}
              question={slides[index]?.question || slide?.question || ""}
              index={index + 1}
              img={slides[index]?.media || slide.media}
              isActive={isActive(index)}
              onClick={() => handleClickSlides(index, slide.type)}
            />
          );
        })}
      </ul>
      <Button
        text="Add slide"
        variant="primary"
        onClick={handleClickAddSlide}
      />
    </div>
  );
};

export default Footer;
