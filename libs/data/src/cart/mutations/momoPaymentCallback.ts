import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import {
  IMomoPaymentResponse,
  IProcessPaymentCallbackPayload,
} from "../models";
import { processPaymentCallbackService } from "../services";

export function useMomoPaymentCallback() {
  return useMutation<
    IResponse<IMomoPaymentResponse>,
    IHttpError,
    IProcessPaymentCallbackPayload
  >(processPaymentCallbackService);
}
