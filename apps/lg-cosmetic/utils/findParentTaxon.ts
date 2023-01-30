import { ICategory } from "@hera/data";

export function findParentTaxon(
  checkTaxon: ICategory,
  currentTaxon: ICategory,
): ICategory | undefined {
  if (checkTaxon.id === currentTaxon.parentId) {
    return checkTaxon;
  }
  const targetTaxon = checkTaxon.taxons.find((t) =>
    currentTaxon.slug.includes(t.slug),
  );
  if (!targetTaxon) {
    return undefined;
  }
  return findParentTaxon(targetTaxon, currentTaxon);
}
