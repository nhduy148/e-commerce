import {
  getListHashtagReview,
  getListReview,
  getReviewDetailsService,
  getReviewRepliesService,
  IHashtagReview,
  IHttpError,
  IListProductReviewParams,
  IPaginateData,
  IProductReviewItem,
  IResponse,
  IReviewReply,
} from "@hera/data";
import { useQuery } from "react-query";

const GET_REVIEW_QUERY_KEY = "GET_REVIEW_QUERY_KEY";
export function useReviewDetailQuery(productId: string | number) {
  return useQuery<IPaginateData<IProductReviewItem>, IHttpError>({
    queryKey: [GET_REVIEW_QUERY_KEY],
    queryFn: () => getReviewDetailsService(productId),
  });
}

const GET_REVIEW_REPLIES_QUERY_KEY = "GET_REVIEW_REPLIES_QUERY_KEY";
export function useReviewRepliesQuery({
  reviewId,
  page,
  size,
}: {
  reviewId: number;
  page: number;
  size: number;
}) {
  return useQuery<IPaginateData<IReviewReply>, IHttpError>({
    queryKey: [
      GET_REVIEW_REPLIES_QUERY_KEY,
      {
        reviewId,
        page,
        size,
      },
    ],
    queryFn: () => getReviewRepliesService({ reviewId, page, size }),
  });
}

export const GET_LIST_PRODUCT_REVIEW = "GET_LIST_PRODUCT_REVIEW";
export function useListReview(params: IListProductReviewParams) {
  return useQuery<IPaginateData<IProductReviewItem>, IHttpError>({
    queryKey: [GET_LIST_PRODUCT_REVIEW, params],
    queryFn: () => getListReview(params),
  });
}

export const GET_LIST_HASHTAG_REVIEW = "GET_LIST_HASHTAG_REVIEW";
export function useListHashtagReview() {
  return useQuery<IResponse<IHashtagReview[]>, IHttpError>({
    queryKey: [GET_LIST_HASHTAG_REVIEW],
    queryFn: getListHashtagReview,
  });
}
