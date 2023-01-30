import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { ICart } from "../models";
import { removePromotion } from "../services";

export function useRemovePromtion() {
  return useMutation<IResponse<ICart>, IHttpError>(removePromotion);
}
