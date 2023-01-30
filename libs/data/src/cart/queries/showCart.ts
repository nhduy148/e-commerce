import { useQuery } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { ICart } from "../models";
import { getShoppingCart } from "../services";

export const SHOPPING_CART_KEY = "SHOPPING_CART_KEY";
export function useShoppingCart() {
  return useQuery<IResponse<ICart>, IHttpError>({
    queryKey: [SHOPPING_CART_KEY],
    queryFn: getShoppingCart,
  });
}
