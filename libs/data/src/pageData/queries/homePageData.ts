import { IOrganization } from "@hera/types";
import { isNil } from "lodash-es";
import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { IResponse } from "../../core/service";
import { IProduct } from "../../pms/models/product";
import { IHomePageData, IShoppage } from "../models";
import {
  getHomePageData,
  getHomePageDataInShopppage,
  getJustForYou,
} from "../services";

type QueryFn = {
  [key in IOrganization]: (
    ...args: any[]
  ) => IShoppage | IHomePageData | Promise<IShoppage | IHomePageData>;
};

export const GET_HOME_PAGE_DATA_KEY = "GET_HOME_PAGE_DATA_KEY";
export function useHomePageDataQuery(organization: IOrganization) {
  const queryFn: QueryFn = {
    gsp: getHomePageDataInShopppage,
    nes: getHomePageDataInShopppage,
    lgc: getHomePageData,
  };
  return useQuery<IShoppage | IHomePageData, IHttpError>({
    queryKey: [GET_HOME_PAGE_DATA_KEY, organization],
    queryFn: queryFn?.[organization],
    refetchIntervalInBackground: false,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    enabled: !isNil(organization),
  });
}

export const GET_JUST_FOR_YOU = "GET_JUST_FOR_YOU";
export function useGetJustForYou() {
  return useQuery<IResponse<IProduct[]>, IHttpError>({
    queryKey: GET_JUST_FOR_YOU,
    queryFn: getJustForYou,
  });
}
