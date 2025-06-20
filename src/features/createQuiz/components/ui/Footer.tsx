import SlideFooterPreview from "./SlideFooterPreview";
import {
  NavigationType,
  type BaseTypeUseQuizFunction,
  type Question,
  type quizType,
} from "../../type";
import { usePath } from "@/hooks/usePath";
import { useEffect, useState } from "react";
import Button from "@/components/ui/ButtonCustom";
import { useGetSlides } from "../../hooks/getRequest";
import { useHandleNavigation } from "../../hooks/useNavigate";

const Footer = ({ quizFunctions }: BaseTypeUseQuizFunction) => {
  const {
    slides,
    quiz,
    addSlides,
    typeQuiz,
    setTypeQuiz,
    selectSlide,
    selectedSlide,
  } = quizFunctions;
  const { path } = usePath();
  const handleNavigation = useHandleNavigation();
  const { slides: slidesApi, isFetching } = useGetSlides(quiz._id);

  const [slidesCli, setSlidesCli] = useState<Question[]>();

  useEffect(() => {
    setSlidesCli(slides);
  }, [slides]);

  useEffect(() => {
    if (!isFetching) {
      if (slides.length === 0 && slidesApi.length > 0) {
        setSlidesCli(slidesApi);
        addSlides(slidesApi);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const handleClickSlides = (index: number, type: quizType | undefined) => {
    if (type) {
      setTypeQuiz(type);
      selectSlide(index);

      if (quiz._id) {
        handleNavigation({
          type: NavigationType.QUIZ_SLIDE,
          slideIndex: index,
          quizId: quiz._id,
        });
      } else {
        handleNavigation({
          type: NavigationType.QUIZ_SLIDE,
          slideIndex: index,
        });
      }
    }
  };

  const isActive = (index: number) => {
    if (path === "new" && slides.length === 1) return true;
    if (isNaN(Number(path))) return false;
    if (path === "setting") {
      return false;
    }
    if (path && Number.isNaN(parseInt(path))) {
      return index === 0;
    }
    return index === parseInt(path ?? "");
  };

  const handleClickAddSlide = () => {
    handleNavigation({
      type: NavigationType.SELECT_TYPE,
    });
  };

  const handleClickSetting = () => {
    handleNavigation({
      type: NavigationType.SETTING,
    });
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
          const currentSlide = selectedSlide?.index === slide.index;
          return (
            <SlideFooterPreview
              key={index}
              question={
                currentSlide
                  ? selectedSlide?.question ?? ""
                  : slide?.question ?? ""
              }
              index={index + 1}
              img={currentSlide ? selectedSlide?.media : slide.media}
              isActive={isActive(index)}
              onClick={() => handleClickSlides(index, slide.type)}
            />
          );
        })}
      </ul>
      <Button
        text="Add slide"
        variant="primary"
        disabled={typeQuiz === "selectType" || !typeQuiz}
        onClick={handleClickAddSlide}
      />
    </div>
  );
};

export default Footer;
