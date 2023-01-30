import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import { IApplyPromotionPayload, ICart } from "../models";
import { applyPromotion } from "../services";

export function useApplyPromtion() {
  return useMutation<IResponse<ICart>, IHttpError, IApplyPromotionPayload>(
    applyPromotion,
  );
}
