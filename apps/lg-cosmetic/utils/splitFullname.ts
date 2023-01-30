import { isSpecialCharacterRegex, vietnameseFullnameRegex } from "@hera/utils";

export const splitFullname = (name: string) => {
  if (typeof name !== "string") {
    throw new Error("Wrong agurment type");
  } else {
    let error = null;
    let firstName = "";
    let lastName = "";
    if (isSpecialCharacterRegex.test(name)) {
      error = "validations.common.donotContainSpecialCharacters";
    } else if (!vietnameseFullnameRegex.test(name)) {
      error = "validations.common.invalidFullName";
    } else {
      error = null;
      const splittedName = name.trim().split(" ");
      firstName = splittedName[0];
      lastName = splittedName[splittedName.length - 1];
    }

    return { error, firstName, lastName };
  }
};
