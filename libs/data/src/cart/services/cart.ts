import * as config from "@hera/config";
import { sentryErrorBoundary } from "@hera/utils";
import { IResponse } from "../../core";
import {
  ADD_TO_CART_ENDPOINT,
  BACK_TO_CART_ENDPOINT,
  DELETE_SHOPPING_CART_ITEM_ENDPOINT,
  ESTIMATE_SHIPPING_COST_ENDPOINT,
  GET_CHECKOUT_CART_ENDPOINT,
  GET_CURRENT_ORDER_ENDPOINT,
  GET_SHOPPING_CART_ENDPOINT,
  GUEST_ADD_TO_CART_ENDPOINT,
  UPDATE_NOTE_ENDPOINT,
} from "../../endpoint";
import {
  Cart,
  IAddToCartPayload,
  ICart,
  IDeleteShoppingCartItemQuery,
  IDeleteShoppingCartItemResponse,
  IShippingMethod,
  IUpdateNotePayload,
} from "../models";

const initCart = {
  data: {
    id: 0,
    itemCount: 0,
    lineItems: [],
    number: null,
    promoTotal: 0,
    shippingLabelUrl: null,
    shippingTotal: 0,
    subTotal: 0,
    total: 0,
  },
};

export const addToCartService = (payload: IAddToCartPayload) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);
  const isLoggedIn =
    JSON.parse(localStorage.getItem(config.env.authKey) || "{}")?.token ||
    false;
  let url = GUEST_ADD_TO_CART_ENDPOINT;
  if (isLoggedIn) {
    url = ADD_TO_CART_ENDPOINT;
  }
  const sentry = sentryErrorBoundary({
    name: "Add cart item",
    type: "Cart",
  });

  if (orderNumber) {
    payload.orderNumber = orderNumber;
  }

  const response = Cart.service.post<IResponse<ICart>>({
    url,
    payload,
  });

  response
    .then((res) => {
      if (res?.data?.number && !orderNumber) {
        localStorage.setItem(config.env.shoppingCartKey, res.data.number);
      }
    })
    .catch(sentry.captureException)
    .finally(sentry.end);

  return response;
};

export const getAuthenticationCart = () => {
  const isLoggedIn =
    JSON.parse(localStorage.getItem(config.env.authKey) || "{}")?.token ||
    false;
  if (!isLoggedIn) {
    return initCart;
  }

  const sentry = sentryErrorBoundary({
    name: "Get Authentication Cart",
    type: "Cart",
  });

  const response = Cart.service.getOne<IResponse<ICart>>({
    url: GET_CURRENT_ORDER_ENDPOINT,
  });

  response
    .then(({ data }) =>
      localStorage.setItem(config.env.shoppingCartKey, data.number as string),
    )
    .catch(sentry.captureException)
    .finally(sentry.end);

  return response;
};

export const getShoppingCart = () => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);

  if (!orderNumber) {
    return initCart;
  }

  const sentry = sentryErrorBoundary({
    name: "Get Cart",
    type: "Cart",
  });
  const response = Cart.service.getOne<IResponse<ICart>>({
    url: GET_SHOPPING_CART_ENDPOINT,
    urlParams: { orderNumber },
  });

  response
    .catch((error) => {
      if (error.code === 404 && orderNumber) {
        localStorage.removeItem(config.env.shoppingCartKey);
      }
      sentry.captureException(error);
      return initCart;
    })
    .finally(sentry.end);

  return response;
};

export const checkShoppingCart = () => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);

  if (!orderNumber) {
    return {
      data: {
        ...initCart.data,
        valid: true,
      },
    };
  }
  const sentry = sentryErrorBoundary({
    name: "Validation cart",
    type: "Cart",
  });

  const response = Cart.service.getOne<IResponse<ICart>>({
    url: GET_CHECKOUT_CART_ENDPOINT,
    urlParams: { orderNumber },
  });

  response.catch(sentry.captureException).finally(sentry.end);

  return response;
};

export const revalidateShoppingCart = () => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);

  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }

  const sentry = sentryErrorBoundary({
    name: "Re-Validate cart",
    type: "Cart",
  });
  const response = Cart.service.post<any>({
    url: BACK_TO_CART_ENDPOINT,
    payload: {},
    urlParams: { orderNumber },
  });

  response.catch(sentry.captureException).finally(sentry.end);

  return response;
};

export const removeCartItemService = (params: IDeleteShoppingCartItemQuery) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);
  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }
  const sentry = sentryErrorBoundary({
    name: "Remove cart item",
    type: "Cart",
    data: params,
  });
  const response = Cart.service.interpolateDelete<
    IResponse<IDeleteShoppingCartItemResponse>
  >(DELETE_SHOPPING_CART_ITEM_ENDPOINT, { ...params, orderNumber });

  response.catch(sentry.captureException).finally(sentry.end);

  return response;
};

export const estimateShippingCost = () => {
  const orderNumber = localStorage?.getItem(config.env.shoppingCartKey) || null;
  const sentry = sentryErrorBoundary({
    name: "Estimate shipping cost",
    type: "Cart",
  });
  if (orderNumber) {
    const response = Cart.service.getOne<IResponse<IShippingMethod[]>>({
      url: ESTIMATE_SHIPPING_COST_ENDPOINT,
      urlParams: { orderNumber },
    });

    response.catch(sentry.captureException).finally(sentry.end);

    return response;
  } else {
    return { data: [] };
  }
};

export const updateNoteService = (payload: IUpdateNotePayload) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);
  if (!orderNumber) {
    return Promise.reject("Missing {orderNumber}");
  }
  const sentry = sentryErrorBoundary({
    name: "Update note order",
    type: "Cart",
    data: payload,
  });
  const url = Cart.service.interpolateUrl(UPDATE_NOTE_ENDPOINT, {
    orderNumber,
  });
  const response = Cart.service.put<IResponse<ICart>>({ url, payload });

  response.catch(sentry.captureException).finally(sentry.end);

  return response;
};
