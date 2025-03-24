import * as yup from "yup";

export const PATTERN_VALID_EMAIL =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const AuthSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .min(6, "Email must be at least 6 characters")
    .max(60, "Email must not exceed 60 characters")
    .matches(PATTERN_VALID_EMAIL, "Email is not valid! ex:xxxxx@xxxx.xxx"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
