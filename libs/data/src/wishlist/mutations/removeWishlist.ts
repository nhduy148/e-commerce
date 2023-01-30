import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import {
  IRemoveWishlistQuery,
  IRemoveWishlistResponse,
  Wishlist,
} from "../models";

export function useRemoveWishlist() {
  return useMutation<IRemoveWishlistResponse, IHttpError, IRemoveWishlistQuery>(
    Wishlist.remove,
  );
}
