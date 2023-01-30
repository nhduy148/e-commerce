import * as Yup from "yup";

export const changePasswordInitialValues = {
  password: "",
  passwordConfirmation: "",
  currentPassword: "",
};

export const changePasswordValidations = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Mật khẩu cũ không được để trống")
    .min(8, "Mật khẩu phải trên 8 ký tự"),

  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải trên 8 ký tự")
    .notOneOf(
      [Yup.ref("currentPassword"), null],
      "Mật khẩu mới không được trùng với mật khẩu cũ",
    ),

  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không trùng khớp")
    .required("Nhập lại mật khẩu không được trống"),
});
