import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { IShippingInfo } from "../models";
import { getShippingInfo } from "../services";

export const GET_SHIPPING_INFO_KEY = "GET_SHIPPING_INFO_KEY";
export function useGetShippingInfo(enabled: boolean = false) {
  return useQuery<IShippingInfo[], IHttpError>({
    queryKey: [GET_SHIPPING_INFO_KEY],
    queryFn: getShippingInfo,
    enabled,
  });
}
