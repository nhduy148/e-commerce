import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import {
  IProcessPaymentClientPayload,
  IProcessPaymentResponse,
} from "../models";
import { processPaymentService } from "../services";

export function useProcessPayment() {
  return useMutation<
    IResponse<IProcessPaymentResponse>,
    IHttpError,
    IProcessPaymentClientPayload
  >(processPaymentService);
}
