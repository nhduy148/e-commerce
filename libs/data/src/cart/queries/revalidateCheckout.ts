import { useQuery } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { ICart } from "../models";
import { revalidateShoppingCart } from "../services";

export const REVALIDATE_CHECKOUT_KEY = "REVALIDATE_CHECKOUT_KEY";
export const useRevalidateCart = () =>
  useQuery<IResponse<ICart>, IHttpError>({
    queryKey: [REVALIDATE_CHECKOUT_KEY],
    queryFn: revalidateShoppingCart,
  });
