import {
  createReviewReplyService,
  createReviewService,
  ICreateReviewPayload,
  ICreateReviewReplyPayload,
  ICreateReviewReplyResponse,
  ICreateReviewResponse,
  IHttpError,
} from "@hera/data";
import { useMutation } from "react-query";

export function useReviewReplyMutation() {
  return useMutation<
    ICreateReviewReplyResponse,
    IHttpError,
    ICreateReviewReplyPayload
  >(createReviewReplyService);
}

export function useProductReviewMutation() {
  return useMutation<ICreateReviewResponse, IHttpError, ICreateReviewPayload>(
    createReviewService,
  );
}
