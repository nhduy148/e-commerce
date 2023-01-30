import {
  IShippingAndBillingAddressPayload,
  IShippingInfoPayload,
  selectShippingAndBillingInitValues,
  shippingInfoInitValues,
} from "@hera/data";
import {
  isStartedSpacing,
  stringWithNoSpecialCharacterRegex,
  vietnamesePhoneNumberRegex,
} from "@hera/utils";
import * as Yup from "yup";

export const shippingInfoInitialValues: IShippingInfoPayload =
  shippingInfoInitValues;

export const selectShippingInfoInitialValues: IShippingAndBillingAddressPayload =
  selectShippingAndBillingInitValues;

export const shippingInfoValidations = Yup.object().shape({
  firstName: Yup.string().required("validations.common.required"),
  lastName: Yup.string().required("validations.common.required"),
  fullName: Yup.string()
    .required("validations.common.fullNameRequired")
    .matches(
      stringWithNoSpecialCharacterRegex,
      "validations.common.fullNameCanNotContainSpecialCharacters",
    ),
  provinceId: Yup.string().required("validations.common.required"),
  districtId: Yup.string().required("validations.common.required"),
  wardId: Yup.string().required("validations.common.required"),
  isDefault: Yup.boolean(),
  addressLine: Yup.string()
    .required("validations.common.addressRequired")
    .matches(isStartedSpacing, "validations.common.invalidAddress"),
  phone: Yup.string()
    .required("validations.common.required")
    .matches(isStartedSpacing, "validations.common.invalidPhoneNumber")
    .matches(
      vietnamesePhoneNumberRegex,
      "validations.common.invalidPhoneNumber",
    ),
});

export const selectShippingAndBillingValidations = Yup.object().shape({
  email: Yup.string()
    .email("validations.common.invalidEmail")
    .required("validations.common.required"),
  firstName: Yup.string().required("validations.common.required"),
  lastName: Yup.string().required("validations.common.required"),
  addressLine1: Yup.string().required("validations.common.required"),
  phone: Yup.string().required("validations.common.required"),
  provinceId: Yup.string().required("validations.common.required"),
  province: Yup.string(),
  districtId: Yup.string().required("validations.common.required"),
  district: Yup.string(),
  wardId: Yup.string().required("validations.common.required"),
  ward: Yup.string(),
});
