import { IUpdateUserProfile } from "@lc/UserSettingComponents";
import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const updateUserProfileInitialValues: IUpdateUserProfile = {
  phone: "",
  email: "",
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
};

export const updateUserProfileValidations = Yup.object().shape({
  email: Yup.string()
    .email("validations.profile.invalidEmail")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      "validations.profile.invalidEmail",
    ),
  firstName: Yup.string()
    .matches(/^[\D ]*$/, "validations.profile.invalidFirstName")
    .max(40)
    .nullable(),
  lastName: Yup.string()
    .matches(/^[\D ]*$/, "validations.profile.invalidLastName")
    .max(40)
    .nullable(),
  phone: Yup.string()
    .matches(phoneRegExp, "validations.profile.invalidPhone")
    .max(10, "validations.profile.maxLengthOfPhone")
    .nullable(),
});
