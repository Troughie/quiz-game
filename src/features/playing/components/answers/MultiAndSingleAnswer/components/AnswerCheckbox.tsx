import { CheckIcon } from "@heroicons/react/24/solid";
import { QUESTION_TYPES, type QuestionType } from "../../../../constant";

interface AnswerCheckboxProps {
  questionType: QuestionType;
  isSelected: boolean;
}

export const AnswerCheckbox = ({
  questionType,
  isSelected,
}: AnswerCheckboxProps) => {
  if (questionType !== QUESTION_TYPES.CHECKBOX_SLIDE) return null;

  return (
    <div
      className={`h-5 w-5 mr-3 flex items-center justify-center border rounded ${
        isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
      }`}
    >
      {isSelected && <CheckIcon className="h-4 w-4 text-white" />}
    </div>
  );
};
