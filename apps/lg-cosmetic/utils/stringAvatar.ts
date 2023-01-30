export function stringAvatar(name: string) {
  const trimmedName = name?.trim();
  let newName = trimmedName?.trim().length === 0 ? " " : trimmedName;

  let nameSize = newName?.split(" ");

  if (nameSize?.length === 1) {
    newName = nameSize[0];
    return {
      children: newName,
    };
  } else if (nameSize[0][0] && nameSize[1][0]) {
    newName =
      nameSize.length === 0
        ? `${nameSize[0][0]}`
        : `${nameSize[0][0]}${nameSize[nameSize.length - 1][0]}`;

    return {
      children: newName,
    };
  }
}
