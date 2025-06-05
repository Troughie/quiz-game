import { useDynamicNavigate } from "@/hooks/useNavigateState";
import { type QuizProp, type SlideType, type SlideTypeProp } from "../type";
import { useLocation } from "react-router";
import { useQuizStore } from "../store/quizStore";
import { createSlide } from "@/helper";
import { useQuizFunction } from "../functional/functional";
const slidesDataType: SlideTypeProp[] = [
  {
    type: "buttonSlide",
    name: "Buttons",
    description: "One correct answer",
  },
  {
    type: "checkBoxSlide",
    name: "Checkboxes",
    description: "Multiple correct answers",
  },
  {
    type: "reorderSlide",
    name: "Reorder",
    description: "Place answers in the correct order",
  },
  {
    type: "rangeSlide",
    name: "Range",
    description: "Guess the answer on a scale",
  },
];
const SelectSlide = () => {
  const navigate = useDynamicNavigate<QuizProp>();
  const { pathname } = useLocation();
  const { handleCreateSlide } = useQuizFunction();
  const {
    addSlide,
    slides,
    setCurrentSlideIndex,
    currentSlideIndex,
    setTypeQuiz,
  } = useQuizStore();

  const handleNavigateSlide = (slideType: SlideType) => {
    const storedQuizId = sessionStorage.getItem("quizId");
    const newSlide = createSlide(slideType);
    setTypeQuiz(slideType);
    // Add slide to the collection
    addSlide(newSlide);

    // Update slide index if we have a quiz ID
    if (storedQuizId) {
      newSlide.index = slides.length;
      handleCreateSlide(newSlide);
    }

    // Handle navigation
    if (storedQuizId && slides.length > 0) {
      handleExistingQuizNavigation(storedQuizId, slideType);
    } else {
      handleNewQuizNavigation(slideType);
    }
  };

  // Helper function for navigation within existing quizzes
  const handleExistingQuizNavigation = (
    quizId: string,
    slideType: SlideType
  ) => {
    const currentPath = pathname.split("/").slice(0, -1).join("/");
    const newPath = `${currentPath}/${quizId}/${slides.length}`;

    navigate(newPath, { typeQuiz: slideType });

    // Update current slide index
    if (currentSlideIndex === slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      setCurrentSlideIndex(slides.length);
    }
  };

  // Helper function for navigation with new quizzes
  const handleNewQuizNavigation = (slideType: SlideType) => {
    if (pathname.includes("new")) {
      navigate(pathname, { typeQuiz: slideType });
    } else {
      navigate(pathname + "/0", { typeQuiz: slideType });
    }
  };

  return (
    <div className="p-4 md:p-8 mx-20">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Add Slide
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {slidesDataType.map((slide, index) => (
          <li
            key={index}
            onClick={() => handleNavigateSlide(slide.type)}
            className="bg-white/10 cursor-pointer  hover:bg-white rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition-all duration-300 text-white hover:text-black"
          >
            <img
              src={`#`}
              alt={slide.type || "#"}
              className="bg-black rounded-full w-16 h-16"
            />
            <div>
              <h2 className="text-lg font-semibold">{slide.type}</h2>
              <p className="">{slide.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectSlide;
