import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { IAddToCartPayload, ICart } from "../models";
import { addToCartService } from "../services";

export function useAddToCartMutation() {
  return useMutation<IResponse<ICart>, IHttpError, IAddToCartPayload>(
    addToCartService,
  );
}
