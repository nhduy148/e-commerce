import { ICategory } from "@hera/data";
import { flatten } from "lodash-es";

export const getAllCategories = (categoriesList: ICategory): string[] => {
  const categorySlugsArr = [];

  categoriesList?.taxons?.forEach((taxon) => {
    if (taxon?.taxons.length === 0) {
      categorySlugsArr.push(taxon?.slug);
    }

    if (taxon?.taxons.length > 0) {
      categorySlugsArr.push(getAllCategories(taxon));
    }
  });

  const flattenCategorySlugsArr = flatten(categorySlugsArr);

  return flattenCategorySlugsArr;
};
