import { sentryErrorBoundary } from "@hera/utils";
import { IResponse } from "../../core";
import { GET_BANNER_DATA_ENDPOINT } from "../../endpoint";
import { BannerData, IBannerData, IBannerDataParam } from "../models";

export function getBannerData(params: IBannerDataParam) {
  const sentry = sentryErrorBoundary({
    name: "getBannerData",
    type: "Page Data",
    data: params,
  });
  const response = BannerData.service.get<IResponse<IBannerData[]>>({
    url: GET_BANNER_DATA_ENDPOINT,
    params,
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
}
