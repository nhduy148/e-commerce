export function itemBreakPoint(itemsreakPoint) {
  return Object.keys(itemsreakPoint).reduce((acc, key) => {
    acc[key] = itemsreakPoint[key];
    return acc;
  }, {});
}
