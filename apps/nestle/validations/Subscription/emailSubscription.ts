import * as Yup from "yup";

export const subscriptionInitialValue = { email: "" };
export const subscriptionValidation = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Email không hợp lệ"),
});
