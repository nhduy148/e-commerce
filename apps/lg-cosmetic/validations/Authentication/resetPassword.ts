import * as Yup from "yup";
export const resetPasswordInitialValues = {
  token: "",
  password: "",
  passwordConfirmation: "",
};
export const resetPasswordValidations = Yup.object().shape({
  token: Yup.string().required("authentication.OTPBlank"),
  password: Yup.string()
    .matches(/^[^\s]*$/g, "authentication.newPasswordSpaces")
    .min(8, "authentication.newPasswordLength")
    .required("authentication.newPasswordBlank"),
  passwordConfirmation: Yup.string()
    .matches(/^[^\s]*$/g, "authentication.confirmNewPasswordSpaces")
    .oneOf(
      [Yup.ref("password"), null],
      "authentication.confirmNewPassWordNotMatch",
    )
    .min(8, "authentication.confirmNewPasswordLength")
    .required("authentication.confirmNewPasswordBlank"),
});
