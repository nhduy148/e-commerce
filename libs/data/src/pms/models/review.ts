import {
  IPaginationQuery,
  IProductReviewItem,
  IUserCommentItem,
  Model,
  ObjectsFactory,
} from "@hera/data";
import { PRODUCT_REVIEW_ENDPOINT } from "../../endpoint";

export interface IReviewReply {
  admin?: {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
  } | null;
  content: string;
  id: number;
  insertedAt: string | number;
  user?: IUserCommentItem;
}

export type IReviewSort = "latest" | "recommend" | "most_react";
export interface IListProductReviewParams extends IPaginationQuery {
  sortBy?: IReviewSort;
  hashtagId?: number;
}

export interface ICreateReviewReplyPayload {
  reviewId: string | number;
  content: string;
}

export interface ICreateReviewReplyResponse {
  data: { msg: string };
  status: string;
}
export interface IHashtagReview {
  id: number;
  name: string;
}

export interface ICreateReviewResponse extends ICreateReviewReplyResponse {}

export interface ICreateReviewPayload {
  productId: number | string;
  data: {
    content: string;
    point: number;
    imageUrls: string[];
  };
}

export class ProductReview extends Model {
  static config = {
    endpoint: PRODUCT_REVIEW_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<IProductReviewItem>(this.config);
}

ProductReview.init(ProductReview.config);
