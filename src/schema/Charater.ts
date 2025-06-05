import * as yup from "yup";
export const CharacterSchema = yup.object().shape({
  username_player: yup.string().required("Email is required"),
});
