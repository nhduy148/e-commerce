import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import {
  IDeleteShippingAddressQuery,
  IDeleteShippingAddressResponse,
  Shipping,
} from "../models";

export function useDeleteShippingAddress() {
  return useMutation<
    IDeleteShippingAddressResponse,
    IHttpError,
    IDeleteShippingAddressQuery
  >((query) => {
    return Shipping.objects.delete<IDeleteShippingAddressResponse>(query.id);
  });
}
