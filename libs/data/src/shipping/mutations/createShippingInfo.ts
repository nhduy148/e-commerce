import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { IShippingInfo, IShippingInfoPayload } from "../models";
import { createShippingInfo } from "../services";

export function useCreateShippingInfo() {
  return useMutation<
    IResponse<IShippingInfo>,
    IHttpError,
    IShippingInfoPayload
  >(createShippingInfo);
}
