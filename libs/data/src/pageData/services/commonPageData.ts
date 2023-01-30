import { CommonPageData } from "@hera/data";
import { sentryErrorBoundary } from "@hera/utils";

export const getCommonPageData = () => {
  const sentry = sentryErrorBoundary({
    name: "getCommonPageData",
    type: "Page Data",
  });
  const response = CommonPageData.objects.find();
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};
