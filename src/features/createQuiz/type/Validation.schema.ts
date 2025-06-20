import * as yup from "yup";

export const ButtonSchema = yup.object().shape({
  question: yup.string().required("Question is required"),
  correctAnswer: yup.string().required("Correct answer is required"),
  wrongAnswers: yup
    .array()
    .of(yup.string().required("Wrong answer cannot be empty"))
    .min(1, "At least one wrong answer is required"),
});
