import {
  IPaginateData,
  IPaginationQuery,
  IResponse,
  Model,
  ObjectsFactory,
} from "../../core";
import {
  BLOG_ENDPOINT,
  PAGE_DATA_ENDPOINT,
  REACT_COMMENT_ENDPOINT,
} from "../../endpoint";

export interface IPageDataItem {
  displayName: string;
  id: number;
  isActive: boolean;
  name: string;
  priority: string;
  slug: string;
}
export interface IListPostParam extends IPaginationQuery {
  categoryId?: number;
  tag?: string;
}
export interface IData<T> {
  data: T[];
}

export interface IPostItem {
  alreadyReaction: boolean;
  category: IPageDataItem;
  categoryId: number;
  commentCount: number;
  content: string;
  coverImage: string;
  excerpt: string;
  heartCount: number;
  id: number;
  isPublished: boolean;
  publishedAt: string;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
  updatedBy: string;
}
export interface IReactPostPayload {
  id: number;
}
export interface ISuccess {
  status: string;
}
export interface IUserCommentItem {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
}

export interface IPostCommentItem {
  alreadyReaction: boolean;
  content: string;
  heartCount: number;
  id: number;
  insertedAt: string;
  parentId: number;
  replies: string[];
  replyCount: number;
  user: IUserCommentItem;
}
export interface IUserCommentPayload {
  content: string;
  id: number;
}
export interface IReactCommentPayload {
  commentId: number;
}

export interface IListCommentPostPayload extends IPaginationQuery {
  postId: number;
}
export class Blog extends Model {
  static config = {
    endpoint: BLOG_ENDPOINT,
  };

  static objects = ObjectsFactory.factory(this.config);

  static blogPageData() {
    return this.service.get<IData<IPageDataItem>>({
      url: PAGE_DATA_ENDPOINT,
    });
  }

  static listPosts(params: IListPostParam) {
    return this.service.get<IPaginateData<IPostItem>>({
      url: BLOG_ENDPOINT,
      params,
    });
  }

  static showPost(slug: string) {
    return this.service.get<IResponse<IPostItem>>({
      url: `${BLOG_ENDPOINT}/${slug}`,
    });
  }

  static reactPost(payload: IReactPostPayload) {
    return this.service.post<IResponse<ISuccess>>({
      url: `${BLOG_ENDPOINT}/${payload.id}/reactions`,
      payload,
    });
  }

  static deleteReactPost(payload: IReactPostPayload) {
    return this.service.delete<IResponse<ISuccess>>({
      url: `${BLOG_ENDPOINT}/${payload.id}/reactions`,
    });
  }

  static listCommentPosts(params: IListCommentPostPayload) {
    return this.service.get<IPaginateData<IPostCommentItem>>({
      url: `${BLOG_ENDPOINT}/${params.postId}/comments`,
      params,
    });
  }

  static commentPost(payload: IUserCommentPayload) {
    return this.service.post<IResponse<ISuccess>>({
      url: `${BLOG_ENDPOINT}/${payload.id}/comments`,
      payload,
    });
  }

  static reactComment(payload: IReactCommentPayload) {
    return this.service.post<IResponse<ISuccess>>({
      url: `${REACT_COMMENT_ENDPOINT}/${payload.commentId}/reactions`,
      payload,
    });
  }

  static deleteReactComment(payload: IReactCommentPayload) {
    return this.service.delete<IResponse<ISuccess>>({
      url: `${REACT_COMMENT_ENDPOINT}/${payload.commentId}/reactions`,
    });
  }
}

Blog.init(Blog.config);
