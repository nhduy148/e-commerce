import * as config from "@hera/config";
import { sentryErrorBoundary } from "@hera/utils";
import { ICart } from "../../cart";
import { IResponse } from "../../core";
import {
  SELECT_SHIPPING_AND_BILLING_ADDRESS,
  SET_SHIPPING_METHOD_ENDPOINT,
} from "../../endpoint";
import {
  IShippingAndBillingAddressPayload,
  IShippingInfo,
  IShippingInfoPayload,
  IShippingMethodQuery,
  Shipping,
} from "../models";

export const getShippingInfo = async () => {
  const sentry = sentryErrorBoundary({
    name: "getShippingInfo",
    type: "Shipping",
  });
  const response = Shipping.objects.find();
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const createShippingInfo = (payload: IShippingInfoPayload) => {
  const sentry = sentryErrorBoundary({
    name: "createShippingInfo",
    type: "Shipping",
    data: payload,
  });
  const response = Shipping.service.post<IResponse<IShippingInfo>>({
    payload,
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const updateShippingInfo = ({
  id,
  ...payload
}: IShippingInfoPayload) => {
  if (!id) {
    return Promise.reject("Missing {id}");
  }
  const sentry = sentryErrorBoundary({
    name: "updateShippingInfo",
    type: "Shipping",
    data: { id, ...payload },
  });
  const response = Shipping.service.put<IResponse<IShippingInfo>>({
    id,
    payload,
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const selectShippingAndBillingAddress = (
  payload: IShippingAndBillingAddressPayload,
) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);

  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }
  const { id: shippingAddressId, ...restPayload } = payload;
  const data = {
    billingAddress: restPayload,
    shippingAddress: restPayload,
    shippingAddressId,
  };
  const sentry = sentryErrorBoundary({
    name: "selectShippingAndBillingAddress",
    type: "Shipping",
    data,
  });
  const response = Shipping.service.post<IResponse<ICart>>({
    url: SELECT_SHIPPING_AND_BILLING_ADDRESS,
    payload: data,
    urlParams: { orderNumber },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const setShippingMethodService = ({
  shippingMethodId,
}: IShippingMethodQuery) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);

  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }
  if (!shippingMethodId) {
    return Promise.reject("Missing {shippingMethodId}");
  }
  const sentry = sentryErrorBoundary({
    name: "getBannerData",
    type: "Shipping",
    data: { shippingMethodId },
  });
  const response = Shipping.service.post<IResponse<ICart>>({
    url:
      SET_SHIPPING_METHOD_ENDPOINT + "?shipping_method_id=" + shippingMethodId,
    payload: {},
    urlParams: { orderNumber },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};
