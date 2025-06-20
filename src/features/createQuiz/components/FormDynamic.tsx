import React, { useEffect, useMemo, useState } from "react";
import AddMedia from "./ui/AddMedia";
import { FormProvider } from "@/context/FormContext";
import InputQuiz from "./ui/Input";
import {
  type BaseTypeUseQuizFunction,
  type Options_change,
  type Question,
  type quizType,
  type TypeQuizProps,
} from "../type";

import RangeSlide from "./RangeSlide";
import ReorderSlide from "./answers/ReorderSlide";
import QuizSetting from "./QuizSetting";
import { VALID_TYPE_CREATE } from "../type/constant";
import { usePath } from "@/hooks/usePath";
import Button from "@/components/ui/ButtonCustom";
import CustomModal from "@/components/ui/Modal";
import { useShowFunction } from "@/store/ShowFunction";
import { NAME_SHOW } from "@/constant";
import { useQuizStore } from "../store/quizStore";
import { useNavigate } from "react-router";
import MultiAndSingleSlide from "./answers/MultiAndSingleSlide";
import FillBankSlide from "./answers/FillBlankSlide";
import { ButtonSchema } from "../type/Validation.Schema";

export interface FormDynamicProps<T extends quizType>
  extends BaseTypeUseQuizFunction {
  QType: T;
}

// Memoize child components to prevent re-renders
const MemoizedMultiAndSingleSlide = React.memo(MultiAndSingleSlide);
const MemoizedRangeSlide = React.memo(RangeSlide);
const MemoizedReorderSlide = React.memo(ReorderSlide);
const MemoizedFillBlank = React.memo(FillBankSlide);
const MemoizedQuizSetting = React.memo(QuizSetting);

const QuestionComponent = React.memo(
  <T extends quizType>({
    QType,
    handleInputChange,
    slide,
  }: Pick<FormDynamicProps<T>, "QType"> & {
    handleInputChange: ({
      value,
      index,
      isCorrect,
      mode,
    }: Options_change) => void;
  } & { slide: Question }) => {
    const renderedComponent = useMemo(() => {
      switch (QType) {
        case "buttonSlide":
          return (
            <MemoizedMultiAndSingleSlide
              handleInputChange={handleInputChange}
              slide={slide}
              QType={QType}
            />
          );
        case "checkBoxSlide":
          return (
            <MemoizedMultiAndSingleSlide
              handleInputChange={handleInputChange}
              slide={slide}
              QType={QType}
            />
          );
        case "rangeSlide":
          return <MemoizedRangeSlide />;
        case "fillBlank":
          return (
            <MemoizedFillBlank
              handleInputChange={handleInputChange}
              slide={slide}
            />
          );
        case "reorderSlide":
          return (
            <MemoizedReorderSlide
              handleInputChange={handleInputChange}
              slide={slide}
            />
          );
        case "settingQuiz":
          return <MemoizedQuizSetting />;
        default:
          return <span>Error!!</span>;
      }
    }, [QType, handleInputChange, slide]);

    return renderedComponent;
  }
);

const FormDynamic = <T extends keyof TypeQuizProps>({
  QType,
  quizFunctions,
}: FormDynamicProps<T>) => {
  const {
    handleInputChange,
    handleDeleteSlide,
    slides,
    currentSlideIndex,
    setTypeQuiz,
    selectedSlide,
    handleEditSlide,
    selectSlide,
    quiz,
    handleCreateQuiz,
  } = quizFunctions;
  const { pathExcludeNum, pathname } = usePath();

  const [slide, setSlide] = useState<Question | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [funFact, setFunFact] = useState<string>("");
  const { isBoolean, setIsBoolean } = useShowFunction();
  const navigate = useNavigate();

  useEffect(() => {
    setSlide(selectedSlide);
    setQuestion(selectedSlide?.question || "");
    setFunFact(selectedSlide?.funFact || "");
  }, [slide, currentSlideIndex, selectedSlide, QType]);

  const deleteSlideFunction = () => {
    if (slides.length === 1) {
      setTypeQuiz("selectType");
      if (pathExcludeNum.includes("new")) {
        navigate(pathname);
      } else {
        navigate(pathExcludeNum);
      }
    } else {
      const newIndex: number =
        currentSlideIndex > 0 ? currentSlideIndex - 1 : 0;
      const newSlide = slides[newIndex];
      if (newSlide && newSlide?.type) {
        setTypeQuiz(newSlide?.type);
        navigate(pathExcludeNum + "/" + newIndex);
        selectSlide(newIndex);
      }
    }
    handleDeleteSlide(slide?._id || "");
  };

  useEffect(() => {
    if (slides.length > 1 && !quiz._id) {
      handleCreateQuiz();
    }

    return () => {
      const { selectedSlideChanged } = useQuizStore.getState();
      if (selectedSlideChanged) {
        handleEditSlide(selectedSlideChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, slides]);

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
        <AddMedia type={QType} quizFunctions={quizFunctions} />
        <div className="w-[500px] sm:pt-6 lg:pt-10 min-h-[700px] bg-black/10 px-4">
          <FormProvider
            defaultValues={{}}
            validationSchema={ButtonSchema}
            onSubmit={() => {}}
          >
            <div className="py-6 relative mt-8 flex flex-col justify-between gap-6 h-full">
              {VALID_TYPE_CREATE.includes(QType) && (
                <InputQuiz
                  maxLength={120}
                  placeholder="Question"
                  name="question"
                  value={question || ""}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    handleInputChange({
                      mode: "question",
                      value: e.target.value,
                    });
                  }}
                />
              )}

              {slide && (
                <QuestionComponent
                  QType={QType}
                  handleInputChange={handleInputChange}
                  slide={slide}
                />
              )}

              {VALID_TYPE_CREATE.includes(QType) && (
                <InputQuiz
                  maxLength={120}
                  placeholder="Fun Fact"
                  name="funFact"
                  value={funFact || ""}
                  backgroundColor="bg-gray-700"
                  onChange={(e) => {
                    setFunFact(e.target.value);
                    handleInputChange({
                      mode: "funFact",
                      value: e.target.value,
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
