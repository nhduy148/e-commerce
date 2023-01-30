import { ISearchKeywordQuery, SearchKeyword } from "@hera/data";

export const getSearchKeywords = (params?: ISearchKeywordQuery) => {
  return SearchKeyword.objects.find(params);
};
