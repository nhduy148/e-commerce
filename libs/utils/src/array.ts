export const chunkArray = (array: Array<any> = [], total: number = 1) => {
  return [...Array(total).keys()].map((_, index) => {
    const count = Math.round(array.length / total);
    return array.slice(count * index, count * (index + 1));
  });
};
