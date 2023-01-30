import { HomePageData, IProduct, IResponse, IShoppage } from "@hera/data";
import { sentryErrorBoundary } from "@hera/utils";
import {
  GET_HOMEPAGE_IN_SHOPPAGE,
  JUST_FOR_YOU_ENDPOINT,
} from "../../endpoint";

export const getHomePageData = () => {
  const sentry = sentryErrorBoundary({
    name: "getBannerData",
    type: "Page Data",
  });
  const response = HomePageData.objects.find();
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const getHomePageDataInShopppage = async () => {
  const sentry = sentryErrorBoundary({
    name: "getBannerData",
    type: "Page Data",
  });
  const response = HomePageData.service.get({
    url: GET_HOMEPAGE_IN_SHOPPAGE,
  });
  response.catch(sentry.captureException).finally(sentry.end);

  // @ts-ignore
  return response as IShoppage;
};

export const getJustForYou = () => {
  const sentry = sentryErrorBoundary({
    name: "getBannerData",
    type: "Page Data",
  });
  const response = HomePageData.service.getOne<IResponse<IProduct[]>>({
    url: JUST_FOR_YOU_ENDPOINT,
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};
