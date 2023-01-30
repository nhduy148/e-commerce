import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import {
  IDeleteShoppingCartItemQuery,
  IDeleteShoppingCartItemResponse,
} from "../models";
import { removeCartItemService } from "../services";

const REMOVE_CART_ITEM_KEY = "REMOVE_CART_ITEM_KEY";
export function useRemoveCartItem() {
  return useMutation<
    IResponse<IDeleteShoppingCartItemResponse>,
    IHttpError,
    IDeleteShoppingCartItemQuery
    // @ts-ignore
  >(removeCartItemService);
}
