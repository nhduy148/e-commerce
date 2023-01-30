import { useQuery } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { getBannerData } from "../services";
import { IBannerData, IBannerDataParam } from "./../models/bannerData";

export const GET_BANNER_DATA = "GET_BANNER_DATA";

export function useBannerData(params: IBannerDataParam) {
  return useQuery<IResponse<IBannerData[]>, IHttpError>({
    queryKey: [GET_BANNER_DATA, params],
    queryFn: () => getBannerData(params),
  });
}
