import * as Yup from "yup";

export const loginInitialValues = { email: "", password: "" };
export const loginValidations = Yup.object().shape({
  email: Yup.string()
    .email("authentication.invalidEmail")
    .required("authentication.emailBlank"),
  password: Yup.string()
    .matches(/^[^\s]*$/g, "authentication.passwordSpaces")
    .min(8, "authentication.passwordLength")
    .required("authentication.passwordBlank"),
});
