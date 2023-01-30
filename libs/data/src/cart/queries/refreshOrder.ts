import { useQuery, useQueryClient } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { ICart } from "../models";
import { checkShoppingCart } from "../services";

export const CHECK_SHOPPING_CART_KEY = "CHECK_SHOPPING_CART_KEY";
export function useRefreshCart() {
  const queryClient = useQueryClient();
  const queries = useQuery<IResponse<ICart>, IHttpError>({
    queryKey: [CHECK_SHOPPING_CART_KEY],
    queryFn: checkShoppingCart,
    cacheTime: 0,
  });
  return {
    setData: (data: IResponse<ICart>) =>
      queryClient.setQueryData([CHECK_SHOPPING_CART_KEY], data),
    ...queries,
  };
}
