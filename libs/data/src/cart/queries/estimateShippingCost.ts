import { useQuery } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { IShippingMethod } from "../models/cart";
import { estimateShippingCost } from "../services";

export const ESTIMATE_SHIPPING_COST_KEY = "ESTIMATE_SHIPPING_COST_KEY";
export function useEstimateShippingCost(isActive: boolean = false) {
  return useQuery<IResponse<IShippingMethod[]>, IHttpError>({
    queryKey: [ESTIMATE_SHIPPING_COST_KEY],
    queryFn: estimateShippingCost,
    enabled: isActive,
  });
}
