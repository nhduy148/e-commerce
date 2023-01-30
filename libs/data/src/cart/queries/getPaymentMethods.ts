import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { IPaymentMethod } from "../models";
import { getPaymentMethods } from "../services";

export const GET_PAYMENT_METHODS_KEY = "GET_PAYMENT_METHODS_KEY";
export function useGetPaymentMethods(isActive: boolean = true) {
  return useQuery<IPaymentMethod[], IHttpError>({
    queryKey: [GET_PAYMENT_METHODS_KEY],
    queryFn: getPaymentMethods,
    enabled: isActive,
  });
}
