import {
  type BaseTypeUseQuizFunction,
  type SlideType,
  type SlideTypeProp,
} from "../type";
import { createSlide } from "@/helper";
import { usePath } from "@/hooks/usePath";
import { useNavigate } from "react-router";
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
  {
    type: "fillBlank",
    name: "Fill in the Blank",
    description: "Complete the sentence with the correct word",
  },
];

const SelectSlide = ({ quizFunctions }: BaseTypeUseQuizFunction) => {
  const navigate = useNavigate();
  const { pathname } = usePath();
  const {
    addSlide,
    slides,
    setCurrentSlideIndex,
    currentSlideIndex,
    setTypeQuiz,
    quiz,
  } = quizFunctions;

  const handleNavigateSlide = async (slideType: SlideType) => {
    const newSlide = createSlide(slideType);
    const newIndex = getNewIndexSlide();
    newSlide.index = newIndex;
    // Add slide to the collection
    setTypeQuiz(slideType);
    addSlide(newSlide);

    // Handle navigation
    if (quiz._id && slides.length > 0) {
      handleExistingQuizNavigation(quiz._id);
    } else {
      handleNewQuizNavigation();
    }
  };

  // Helper function for navigation within existing quizzes
  const handleExistingQuizNavigation = (quizId: string) => {
    const currentPath = pathname.includes("new")
      ? pathname.split("/").slice(0, -1).join("/")
      : "/edit";

    const newPath = `${currentPath}/${quizId}/${slides.length}`;
    navigate(newPath);

    // Update current slide index
    const newIndex = getNewIndexSlide();
    setCurrentSlideIndex(newIndex);
  };

  const getNewIndexSlide = () => {
    let newIndex;
    if (currentSlideIndex === slides.length - 1) {
      newIndex = currentSlideIndex + 1;
    } else {
      newIndex = slides.length;
    }
    return newIndex;
  };

  // Helper function for navigation with new quizzes
  const handleNewQuizNavigation = () => {
    const newIndex = getNewIndexSlide();
    if (pathname.includes("new")) {
      const newPath = newIndex === 0 ? "" : "/" + newIndex;
      navigate(pathname + newPath);
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
