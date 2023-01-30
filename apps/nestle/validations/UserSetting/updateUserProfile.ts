import {
  isStartedSpacing,
  stringWithNoSpecialCharacterRegex,
  vietnamesePhoneNumberRegex,
} from "@hera/utils";
import { IUpdateUserProfile } from "@nestle/UserSettingComponents";
import * as Yup from "yup";

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
  lastName: Yup.string()
    .matches(/^[\D ]*$/, "validations.profile.invalidLastName")
    .matches(isStartedSpacing, "validations.profile.invalidLastName")
    .matches(
      stringWithNoSpecialCharacterRegex,
      "validations.profile.noSpecialCharacterInLastName",
    )
    .nullable(),

  firstName: Yup.string()
    .matches(/^[\D ]*$/, "validations.profile.invalidFirstName")
    .matches(isStartedSpacing, "validations.profile.invalidFirstName")
    .matches(
      stringWithNoSpecialCharacterRegex,
      "validations.profile.noSpecialCharacterInFirstName",
    )
    .nullable(),

  phone: Yup.string()
    .matches(vietnamesePhoneNumberRegex, "validations.profile.invalidPhone")
    .max(10, "validations.profile.maxLengthOfPhone")
    .nullable(),
});
