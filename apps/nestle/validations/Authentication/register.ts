import { isStartedSpacing, vietnamesePhoneNumberRegex } from "@hera/utils";
import * as Yup from "yup";
export const registerInitialValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  phone: "",
};
export const registerValidations = Yup.object().shape({
  email: Yup.string()
    .email("authentication.invalidEmail")
    .required("authentication.emailBlank"),
  password: Yup.string()
    .matches(/^[^\s]*$/g, "authentication.passwordSpaces")
    .min(8, "authentication.passwordLength")
    .required("authentication.passwordBlank"),
  passwordConfirmation: Yup.string()
    .matches(/^[^\s]*$/g, "authentication.confirmPasswordSpaces")
    .oneOf(
      [Yup.ref("password"), null],
      "authentication.confirmPassWordNotMatch",
    )
    .min(8, "authentication.confirmPasswordLength")
    .required("authentication.confirmPasswordBlank"),
  phone: Yup.string()
    .matches(
      /^[^\`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]*$/g,
      "authentication.phoneWrong",
    )
    .matches(isStartedSpacing, "authentication.phoneWrong")
    .matches(vietnamesePhoneNumberRegex, "authentication.phoneWrong"),
});
