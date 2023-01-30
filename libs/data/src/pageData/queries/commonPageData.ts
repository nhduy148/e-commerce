import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { ICommonPageData } from "../models";
import { getCommonPageData } from "../services";

export const PAGE_DATA_KEY = "PAGE_DATA_KEY";
export function useCommonPageDataQuery() {
  return useQuery<ICommonPageData, IHttpError>({
    queryKey: [PAGE_DATA_KEY],
    queryFn: getCommonPageData,
    refetchIntervalInBackground: false,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
  });
}
