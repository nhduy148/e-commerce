import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import { ICreateCommentPayload, IProductReviewItem, Product } from "../models";

export function useReviewProduct() {
  return useMutation<IProductReviewItem, IHttpError, ICreateCommentPayload>(
    (payload) => {
      return Product.commentPost(payload.productId, payload.data).then(
        (res) => res.data,
      );
    },
  );
}
