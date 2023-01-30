import { isStartedSpacing, vietnamesePhoneNumberRegex } from "@hera/utils";
import * as Yup from "yup";
export const getSampleValues = {
  name: "",
  phone: "",
  email: "",
  gestationalAge: "",
  childAge: "",
};
export const getSampleValidations = Yup.object().shape({
  email: Yup.string().email("authentication.invalidEmail"),
  name: Yup.string().required("getSample.contactNameBlank"),
  phone: Yup.string()
    .matches(
      /^[^\`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]*$/g,
      "authentication.phoneWrong",
    )
    .matches(isStartedSpacing, "authentication.phoneWrong")
    .matches(vietnamesePhoneNumberRegex, "authentication.phoneWrong")
    .required("getSample.phoneBlank"),
});
