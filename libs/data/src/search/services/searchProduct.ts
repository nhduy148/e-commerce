import { ISearchProductQuery, SearchProduct } from "@hera/data";
export const getSearchProducts = (params?: ISearchProductQuery) => {
  return SearchProduct.objects.paginate(params);
};
