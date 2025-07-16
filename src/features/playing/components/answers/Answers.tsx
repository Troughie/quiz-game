import React from "react";
import type { QuestionType } from "../../constant";
import type { MultiAndSingleAnswerProps } from "./MultiAndSingleAnswer";
import MultiAndSingleAnswer from "./MultiAndSingleAnswer";
import FillBlank from "./FillBlank";

interface AnswerProps
    extends Pick<
        MultiAndSingleAnswerProps,
        | "question"
        | "disabled"
        | "selectedAnswers"
        | "showingCorrectAnswer"
        | "isPause"
        | "handleAnswerClick"
    > {
    QType: QuestionType;
    indexAnswersCorrect: number[];
    handleAnswerSubmit: (text: string) => void;
    isCorrectAnswerFillBlank?: boolean;
    correctText?: string;
    textPlayerAnswer: string[];
}
export const AnswerComponents = React.memo(
    ({
        QType,
        indexAnswersCorrect,
        correctText,
        textPlayerAnswer,
        ...commonProps
    }: AnswerProps) => {
        const {
            question,
            handleAnswerSubmit,
            isCorrectAnswerFillBlank,
            showingCorrectAnswer,
        } = commonProps;
        switch (QType) {
            case "buttonSlide":
            case "checkBoxSlide":
                return question.answers?.map((answer, index) => {
                    return (
                        <MultiAndSingleAnswer
                            key={index}
                            {...commonProps}
                            answer={answer}
                            index={index}
                            isAnswerCorrect={
                                indexAnswersCorrect?.length > 0 &&
                                indexAnswersCorrect.includes(index)
                            }
                        />
                    );
                });
            case "fillBlank":
                return (
                    <FillBlank
                        handleAnswerSubmit={handleAnswerSubmit}
                        isCorrectAnswerFillBlank={isCorrectAnswerFillBlank}
                        showingCorrectAnswer={showingCorrectAnswer}
                        correctText={correctText}
                        textPlayerAnswer={textPlayerAnswer}
                    />
                );

            default:
                return <span>Error!!</span>;
        }
    }
);
