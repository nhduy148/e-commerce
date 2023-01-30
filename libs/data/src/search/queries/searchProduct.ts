import { useQuery } from "react-query";
import { IHttpError, IPaginateData } from "../../core";
import { IProduct } from "../../pms";
import { ISearchProductQuery } from "../models";
import { getSearchProducts } from "../services";

export const SEARCH_PRODUCT_KEY = "SEARCH_PRODUCT_KEY";
export function useSearchProductsQuery(params?: ISearchProductQuery) {
  return useQuery<IPaginateData<IProduct>, IHttpError>({
    queryKey: [SEARCH_PRODUCT_KEY, params],
    queryFn: () => getSearchProducts(params),
    refetchIntervalInBackground: false,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
  });
}
