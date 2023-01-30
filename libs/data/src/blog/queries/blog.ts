import { useQuery } from "react-query";
import { IPaginateData, IResponse } from "../../core";
import {
  Blog,
  IData,
  IListCommentPostPayload,
  IListPostParam,
  IPageDataItem,
  IPostCommentItem,
  IPostItem,
} from "../models";

export const BLOG_PAGE_DATA = "BLOG_PAGE_DATA";
export function useGetBlogPageData() {
  return useQuery<IData<IPageDataItem>>({
    queryKey: [BLOG_PAGE_DATA],
    queryFn() {
      return Blog.blogPageData();
    },
  });
}

export const BLOG_LIST_POSTS = "BLOG_LIST_POSTS";
export function useGetBlogListPost(param: IListPostParam) {
  return useQuery<IPaginateData<IPostItem>>({
    queryKey: [BLOG_LIST_POSTS, param],
    queryFn() {
      return Blog.listPosts(param);
    },
  });
}

export const SHOW_POST = "SHOW_POST";
export function useShowPost(slug: string) {
  return useQuery<IResponse<IPostItem>>({
    queryKey: [SHOW_POST, slug],
    queryFn() {
      return Blog.showPost(slug);
    },
  });
}

export const SHOW_LIST_COMMENT_POST = "SHOW_LIST_COMMENT_POST";
export function useShowPostComment(params: IListCommentPostPayload) {
  return useQuery<IPaginateData<IPostCommentItem>>({
    queryKey: [SHOW_LIST_COMMENT_POST, params],
    queryFn() {
      return Blog.listCommentPosts(params);
    },
  });
}
