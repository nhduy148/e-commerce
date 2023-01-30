import {
  ICreateReviewPayload,
  ICreateReviewReplyPayload,
  ICreateReviewReplyResponse,
  ICreateReviewResponse,
  IHashtagReview,
  IListProductReviewParams,
  IPaginateData,
  IProductReviewItem,
  IResponse,
  IReviewReply,
  ProductReview,
} from "@hera/data";
import { sentryErrorBoundary } from "@hera/utils";
import {
  GET_LIST_HASHTAG_REVIEW_ENDPOINT,
  LIST_PRODUCT_REVIEW_ENDPOINT,
  PRODUCT_REVIEW_ENDPOINT_3,
  REPLY_REVIEW_ENDPOINT,
} from "../../endpoint";

export const getReviewDetailsService = (productId: string | number) => {
  return ProductReview.service.getOne<IPaginateData<IProductReviewItem>>({
    url: `${ProductReview.config.endpoint}/${productId}/reviews`,
  });
};

export const getReviewRepliesService = ({
  reviewId,
  page,
  size,
}: {
  reviewId: number;
  page: number;
  size: number;
}) => {
  const sentry = sentryErrorBoundary({
    name: "getReviewRepliesService",
    type: "Review",
    data: { reviewId, page, size },
  });
  const response = ProductReview.service.getOne<IPaginateData<IReviewReply>>({
    url: REPLY_REVIEW_ENDPOINT,
    params: {
      reviewId,
      page,
      size,
    },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const createReviewReplyService = (
  payload: ICreateReviewReplyPayload,
) => {
  const sentry = sentryErrorBoundary({
    name: "createReviewReplyService",
    type: "Review",
    data: payload,
  });
  const response = ProductReview.service.post<ICreateReviewReplyResponse>({
    payload,
    url: REPLY_REVIEW_ENDPOINT,
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const createReviewService = (payload: ICreateReviewPayload) => {
  const sentry = sentryErrorBoundary({
    name: "createReviewService",
    type: "Review",
    data: payload,
  });
  const response = ProductReview.service.post<ICreateReviewResponse>({
    payload: {
      ...payload.data,
    },
    url: PRODUCT_REVIEW_ENDPOINT_3,
    urlParams: {
      productId: payload.productId,
    },
  });
  response.catch(sentry.captureException).finally(sentry.end);
  return response;
};

export const getListReview = (params: IListProductReviewParams) => {
  return ProductReview.service.get<IPaginateData<IProductReviewItem>>({
    url: LIST_PRODUCT_REVIEW_ENDPOINT,
    params,
  });
};

export const getListHashtagReview = () => {
  return ProductReview.service.get<IResponse<IHashtagReview[]>>({
    url: GET_LIST_HASHTAG_REVIEW_ENDPOINT,
  });
};
