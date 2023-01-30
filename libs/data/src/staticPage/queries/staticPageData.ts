import {
  IHttpError,
  IResponse,
  IStaticPageData,
  StaticPageData,
} from "@hera/data";
import { useQuery } from "react-query";

import { IStaticPageDataParam } from "./../model/staticPageData";

export const GET_STATIC_PAGE_DATA_KEY = "GET_STATIC_PAGE_DATA_KEY";
export function useStaticPageDataQuery(params: IStaticPageDataParam) {
  return useQuery<IResponse<IStaticPageData>, IHttpError>({
    queryKey: [GET_STATIC_PAGE_DATA_KEY, params],
    queryFn() {
      return StaticPageData.getStaticPageData(params);
    },
  });
}
