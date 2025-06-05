import React, { useEffect, useMemo, useState } from "react";
import AddMedia from "./ui/AddMedia";
import { FormProvider } from "@/context/FormContext";
import InputQuiz from "./ui/Input";
import {
  ButtonSchema,
  type Question,
  type QuizProp,
  type TypeQuizProps,
} from "../type";
import { useQuizStore } from "../store/quizStore";

import CheckBoxSlide from "./CheckBoxSlide";
import RangeSlide from "./RangeSlide";
import ReorderSlide from "./ReorderSlide";
import QuizSetting from "./QuizSetting";
import { VALID_TYPE_CREATE } from "../constant";
import { useQuizFunction, type Options_change } from "../functional/functional";
import { usePath } from "@/hooks/usePath";
import ButtonSlide from "./ButtonSlide";
import Button from "@/components/ui/ButtonCustom";
import CustomModal from "@/components/ui/Modal";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW } from "@/constant";
import { useDynamicNavigate } from "@/hooks/useNavigateState";

type ExtraKeys = "settingQuiz";
type CustomKeys = keyof TypeQuizProps | ExtraKeys;
export type FormDynamicProps<T extends CustomKeys> = {
  QType: T;
};

// Memoize child components to prevent re-renders
const MemoizedButtonSlide = React.memo(ButtonSlide);
const MemoizedCheckBoxSlide = React.memo(CheckBoxSlide);
const MemoizedRangeSlide = React.memo(RangeSlide);
const MemoizedReorderSlide = React.memo(ReorderSlide);
const MemoizedQuizSetting = React.memo(QuizSetting);

const QuestionComponent = React.memo(
  <T extends CustomKeys>({
    QType,
    handleAnswerChange,
    slide,
  }: FormDynamicProps<T> & {
    handleAnswerChange: ({
      value,
      index,
      isCorrect,
      mode,
      slideIdProp,
    }: Options_change) => void;
  } & { slide: Question }) => {
    const renderedComponent = useMemo(() => {
      switch (QType) {
        case "buttonSlide":
          return (
            <MemoizedButtonSlide
              handleAnswerChange={handleAnswerChange}
              slide={slide}
            />
          );
        case "checkBoxSlide":
          return (
            <MemoizedCheckBoxSlide
              handleAnswerChange={handleAnswerChange}
              slide={slide}
            />
          );
        case "rangeSlide":
          return <MemoizedRangeSlide />;
        case "reorderSlide":
          return (
            <MemoizedReorderSlide
              handleAnswerChange={handleAnswerChange}
              slide={slide}
            />
          );
        case "settingQuiz":
          return <MemoizedQuizSetting />;
        default:
          return <span>Error!!</span>;
      }
    }, [QType, handleAnswerChange, slide]);

    return renderedComponent;
  }
);

const FormDynamic = <T extends keyof TypeQuizProps>({
  QType,
}: FormDynamicProps<T>) => {
  const { pathExcludeNum, pathname } = usePath();
  const { handleAnswerChange, handleCreateQuiz, handleDeleteSlide } =
    useQuizFunction();
  const [slide, setSlide] = useState<Question>();
  const { slides, setCurrentSlideIndex, currentSlideIndex, setTypeQuiz } =
    useQuizStore();
  const [question, setQuestion] = useState<string>("");
  const [funFact, setFunFact] = useState<string>("");
  const { isBoolean, setIsBoolean } = useShowFunction();
  const navigate = useDynamicNavigate<QuizProp>();

  useEffect(() => {
    const currentSlide = slides[currentSlideIndex];

    setSlide(currentSlide);
    setQuestion(currentSlide?.question || "");
    setFunFact(currentSlide?.funFact || "");
  }, [slide, currentSlideIndex, slides]);

  const handleSubmit = (data: unknown) => {
    console.log(data);
  };

  useEffect(() => {
    const timeOutCreateQuiz = setTimeout(() => {
      const isQuizCreated = sessionStorage.getItem("quiz_created");

      if (pathExcludeNum.includes("new") && !isQuizCreated) {
        console.log("Creating quiz...");
        sessionStorage.setItem("quiz_created", "true");
        handleCreateQuiz();
      }
    }, 2000);

    return () => {
      clearTimeout(timeOutCreateQuiz);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteSlideFunction = () => {
    console.log(slides.length);

    if (slides.length === 1) {
      if (pathExcludeNum.includes("new")) {
        navigate(pathname, { typeQuiz: "selectType" });
      } else {
        navigate(pathExcludeNum, { typeQuiz: "selectType" });
      }
      setTypeQuiz("selectType");
    } else {
      const newIndex: number =
        currentSlideIndex > 0 ? currentSlideIndex - 1 : 0;
      const newSlide = slides[newIndex];
      if (newSlide && newSlide?.type) {
        sessionStorage.setItem("slideIndex", newIndex.toString());
        navigate(pathExcludeNum + "/" + newIndex, { typeQuiz: newSlide.type });
        setCurrentSlideIndex(newIndex);
      }
    }
    handleDeleteSlide(slide?._id || "");
  };

  // Don't render anything until we have the current slide data
  if (!slide) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomModal
        isOpen={isBoolean[NAME_SHOW.DELETE_SLIDE]}
        onOpenChange={() =>
          setIsBoolean(
            NAME_SHOW.DELETE_SLIDE,
            !isBoolean[NAME_SHOW.DELETE_SLIDE]
          )
        }
        width="lg"
        maxWidth="3xl"
        confirmText="Submit"
        onConfirm={deleteSlideFunction}
        confirmButtonProps={{ variant: "danger" }}
        cancelButtonProps={{ variant: "warning" }}
      >
        <div>
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-red-500">
            <p>Are you want to delete this slide!!</p>
          </div>
        </div>
      </CustomModal>
      <div className="flex gap-6 flex-wrap justify-center items-center md:items-start">
        <AddMedia type={QType} handleAnswerChange={handleAnswerChange} />
        <div className="w-[500px] pt-32 lg:pt-10 min-h-[700px] bg-black/10 px-4">
          <FormProvider
            defaultValues={{}}
            validationSchema={ButtonSchema}
            onSubmit={handleSubmit}
          >
            <div className="py-6 relative flex flex-col justify-between gap-6 h-full">
              {VALID_TYPE_CREATE.includes(QType) && (
                <InputQuiz
                  maxLength={120}
                  title="Question"
                  name="question"
                  value={question || ""}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    handleAnswerChange({
                      mode: "question",
                      value: e.target.value,
                      slideIdProp: slide._id || "",
                    });
                  }}
                />
              )}

              <QuestionComponent
                QType={QType}
                handleAnswerChange={handleAnswerChange}
                slide={slide}
              />

              {VALID_TYPE_CREATE.includes(QType) && (
                <InputQuiz
                  maxLength={120}
                  title="Fun Fact"
                  name="funFact"
                  value={funFact || ""}
                  backgroundColor="bg-gray-700"
                  onChange={(e) => {
                    setFunFact(e.target.value);
                    handleAnswerChange({
                      mode: "funFact",
                      value: e.target.value,
                      slideIdProp: slide._id || "",
                    });
                  }}
                  borderColor="border-gray-700"
                />
              )}
            </div>
            <Button
              onClick={() => {
                setIsBoolean(NAME_SHOW.DELETE_SLIDE, true);
              }}
              fullWidth
              variant="danger"
              text={"Delete"}
            />
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default FormDynamic;
