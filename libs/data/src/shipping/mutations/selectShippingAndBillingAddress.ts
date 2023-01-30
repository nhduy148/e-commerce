import { useMutation } from "react-query";
import { ICart } from "../../cart";
import { IHttpError, IResponse } from "../../core";
import { IShippingAndBillingAddressPayload } from "../models";
import { selectShippingAndBillingAddress } from "../services";

export function useSelectShippingAndBillingAddress() {
  return useMutation<
    IResponse<ICart>,
    IHttpError,
    IShippingAndBillingAddressPayload
  >(selectShippingAndBillingAddress);
}
