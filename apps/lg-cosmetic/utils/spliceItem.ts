export const spliceItem = (x, y) => {
  let newArray = [];
  //@ts-ignore
  newArray = x.splice(x.indexOf(y), 1);
  return newArray;
};
