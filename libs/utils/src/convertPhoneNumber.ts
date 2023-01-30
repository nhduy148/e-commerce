import { isSpecialCharacterRegex, vietnamesePhoneNumberRegex } from "./regex";

export const convertPhoneNumber = (phone: string | number) => {
  let formattedPhone = phone.toString().trim();

  if (vietnamesePhoneNumberRegex.test(formattedPhone)) {
    if (formattedPhone.startsWith("+84")) {
      formattedPhone = formattedPhone.replace("+84", "0");
      if (!isSpecialCharacterRegex.test(formattedPhone)) {
        throw new SyntaxError(
          `{"phone": "validations.common.invalidPhoneNumber"}`,
        );
      }
    }
    if (formattedPhone.startsWith("84")) {
      return formattedPhone.replace("84", "0");
    }
    return formattedPhone;
  } else {
    throw new SyntaxError(`{"phone": "validations.common.invalidPhoneNumber"}`);
  }
};
