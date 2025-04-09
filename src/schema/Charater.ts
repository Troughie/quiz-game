import * as yup from "yup";
export const CharacterSchema = yup.object().shape({
  name: yup.string().required("Email is required"),
});
