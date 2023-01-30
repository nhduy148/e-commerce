import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { ISearchKeyword, ISearchKeywordQuery } from "../models";
import { getSearchKeywords } from "../services";

export const SEARCH_KEYWORD_KEY = "SEARCH_KEYWORD_KEY";
export function useSearchKeywordsQuery(params?: ISearchKeywordQuery) {
  return useQuery<ISearchKeyword[], IHttpError>({
    queryKey: [SEARCH_KEYWORD_KEY, params],
    queryFn: () => getSearchKeywords(params),
    refetchIntervalInBackground: false,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
  });
}
