import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { IShippingInfo, IShippingInfoPayload } from "../models";
import { updateShippingInfo } from "../services";

export function useUpdateShippingInfo() {
  return useMutation<
    IResponse<IShippingInfo>,
    IHttpError,
    IShippingInfoPayload
  >(updateShippingInfo);
}
