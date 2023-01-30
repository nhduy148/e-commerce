import { IItemPerBreakPoint } from "@lc/types";

export function itemPerBreakPoint(itemsPerBreakPoints: IItemPerBreakPoint) {
  return Object.keys(itemsPerBreakPoints).reduce((acc, key) => {
    acc[key] = 12 / itemsPerBreakPoints[key];
    return acc;
  }, {});
}
