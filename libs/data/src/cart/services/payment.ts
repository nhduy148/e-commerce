import * as config from "@hera/config";
import { sentryErrorBoundary } from "@hera/utils";
import { IResponse } from "../../core";
import {
  PAYMENT_CALLBACK_ENDPOINT,
  PROCESS_PAYMENT_ENDPOINT,
  SET_PAYMENT_METHOD_ENDPOINT,
} from "../../endpoint";
import {
  ICart,
  IMomoPaymentResponse,
  IPaymentMethodQuery,
  IProcessPaymentCallbackPayload,
  IProcessPaymentClientPayload,
  IProcessPaymentResponse,
  Payment,
} from "../models";

export const getPaymentMethods = () => {
  const sentry = sentryErrorBoundary({
    name: "Get Payment Methods",
    type: "Payment",
  });
  const response = Payment.objects.find();
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const setPaymentMethodService = ({
  paymentMethodId,
}: IPaymentMethodQuery) => {
  const orderNumber = localStorage.getItem(config.env.shoppingCartKey);
  if (!orderNumber) {
    return Promise.reject("missing orderNumber");
  }
  if (!paymentMethodId) {
    return Promise.reject("missing id");
  }
  const sentry = sentryErrorBoundary({
    name: "Select Payment Method",
    type: "Payment",
  });
  const response = Payment.service.post<IResponse<ICart>>({
    url: SET_PAYMENT_METHOD_ENDPOINT + "?payment_method_id=" + paymentMethodId,
    payload: {},
    urlParams: { orderNumber },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const processPaymentService = ({
  paymentId,
  ...payload
}: IProcessPaymentClientPayload) => {
  if (!paymentId) {
    return Promise.reject("Missing {paymentId}");
  }
  const sentry = sentryErrorBoundary({
    name: "Process Payment",
    type: "Payment",
    data: { ...payload, paymentId },
  });
  const response = Payment.service.post<IResponse<IProcessPaymentResponse>>({
    url: PROCESS_PAYMENT_ENDPOINT,
    payload,
    urlParams: { paymentId },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const processPaymentCallbackService = ({
  paymentId,
  ...payload
}: IProcessPaymentCallbackPayload) => {
  if (!paymentId) {
    return Promise.reject("Missing {paymentId}");
  }
  const sentry = sentryErrorBoundary({
    name: "Process Payment Callback",
    type: "Payment",
    data: { ...payload, paymentId },
  });
  const url = `${PAYMENT_CALLBACK_ENDPOINT}?payment_id=${paymentId}`;
  const response = Payment.service.post<IResponse<IMomoPaymentResponse>>(
    {
      url,
      payload,
    },
    false,
  );
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};
