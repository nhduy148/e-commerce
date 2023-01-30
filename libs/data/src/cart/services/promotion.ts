import * as config from "@hera/config";
import { sentryErrorBoundary } from "@hera/utils";
import { IResponse } from "../../core";
import {
  APPLY_PROMOTION_ENDPOINT,
  REMOVE_PROMOTION_ENDPOINT,
} from "../../endpoint";
import { Cart, IApplyPromotionPayload, ICart } from "../models";

export const applyPromotion = (payload: IApplyPromotionPayload) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);
  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }
  const sentry = sentryErrorBoundary({
    name: "Add Promotion",
    type: "Payment",
    data: payload,
  });
  const response = Cart.service.post<IResponse<ICart>>({
    url: APPLY_PROMOTION_ENDPOINT,
    payload,
    urlParams: { orderNumber },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const removePromotion = () => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);
  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }
  const sentry = sentryErrorBoundary({
    name: "Remove Promotion",
    type: "Payment",
  });
  const response = Cart.service.post<IResponse<ICart>>({
    url: REMOVE_PROMOTION_ENDPOINT,
    payload: {},
    urlParams: { orderNumber },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};
