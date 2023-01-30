import * as Yup from "yup";
export const forgotPasswordInitialValues = { email: "" };
export const forgotPasswordValidations = Yup.object().shape({
  email: Yup.string()
    .email("authentication.invalidEmail")
    .required("authentication.emailBlank"),
});
