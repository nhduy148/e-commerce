export const splitFullName = (name: string) => {
  let firstName = "";
  let lastName = "";

  const splittedName = name.trim().split(" ");
  firstName = splittedName[0];
  splittedName.length > 1
    ? (lastName = splittedName[splittedName.length - 1])
    : (lastName = " ");

  return { firstName, lastName };
};
