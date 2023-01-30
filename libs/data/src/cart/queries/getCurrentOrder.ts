import { useQuery } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { ICart } from "../models/cart";
import { getAuthenticationCart } from "../services";

export const GET_AUTHENTICATED_CART = "GET_AUTHENTICATED_CART";
export function useAuthenticatedCart() {
  return useQuery<IResponse<ICart>, IHttpError>({
    queryKey: [GET_AUTHENTICATED_CART],
    queryFn: getAuthenticationCart,
  });
}
