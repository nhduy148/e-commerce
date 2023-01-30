import { IGetSampleShipping } from "@hera/data";
import {
  isStartedSpacing,
  stringWithNoSpecialCharacterRegex,
  vietnamesePhoneNumberRegex,
} from "@hera/utils";
import * as Yup from "yup";

export const customerInfoValidations = Yup.object().shape({
  customerInfo: Yup.object().shape({
    firstName: Yup.string().required("validations.common.required"),
    lastName: Yup.string().required("validations.common.required"),
    displayName: Yup.string()
      .required("validations.common.fullNameRequired")
      .matches(
        stringWithNoSpecialCharacterRegex,
        "validations.common.fullNameCanNotContainSpecialCharacters",
      ),

    email: Yup.string()
      .required("validations.common.invalidEmail")
      .email("validations.common.invalidEmail"),
    phone: Yup.string()
      .required("validations.common.required")
      .matches(isStartedSpacing, "validations.common.invalidPhoneNumber")
      .matches(
        vietnamesePhoneNumberRegex,
        "validations.common.invalidPhoneNumber",
      ),
    provinceId: Yup.string().required("validations.common.required").nullable(),
    districtId: Yup.string().required("validations.common.required").nullable(),
    wardId: Yup.string().required("validations.common.required").nullable(),
    address: Yup.string()
      .required("validations.common.addressRequired")
      .matches(isStartedSpacing, "validations.common.invalidAddress"),
  }),
});

export const customerInfoInitialValues: IGetSampleShipping = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  phone: "",
  provinceId: null,
  districtId: null,
  wardId: null,
  displayName: "",
};
