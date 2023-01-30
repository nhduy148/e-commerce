import { ICategory } from "@hera/data";

export const getAllTaxonvalues = (listCategories: ICategory): ICategory[] => {
  let newArray = [];
  if (!listCategories) {
    return [];
  }
  if (listCategories?.taxons?.length > 0) {
    listCategories.taxons.forEach((item) => {
      newArray.push(item, ...getAllTaxonvalues(item));
    });
  }
  return newArray;
};
