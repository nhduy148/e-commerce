import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { IAddWishlistPayload, IAddWishlistResponse, Wishlist } from "../models";

export function useAddWishlist() {
  return useMutation<
    IResponse<IAddWishlistResponse>,
    IHttpError,
    IAddWishlistPayload
  >(Wishlist.add);
}
