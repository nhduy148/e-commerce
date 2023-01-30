import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import {
  Blog,
  IReactCommentPayload,
  IReactPostPayload,
  ISuccess,
  IUserCommentPayload,
} from "../models";

export function useReactPost() {
  return useMutation<ISuccess, IHttpError, IReactPostPayload>((payload) => {
    return Blog.reactPost(payload).then((res) => res.data);
  });
}

export function useDeleteReactPost() {
  return useMutation<ISuccess, IHttpError, IReactPostPayload>((payload) => {
    return Blog.deleteReactPost(payload).then((res) => res.data);
  });
}

export function useCommentPost() {
  return useMutation<ISuccess, IHttpError, IUserCommentPayload>((payload) => {
    return Blog.commentPost(payload).then((res) => res.data);
  });
}

export function useReactComment() {
  return useMutation<ISuccess, IHttpError, IReactCommentPayload>((payload) => {
    return Blog.reactComment(payload).then((res) => res.data);
  });
}
export function useDeleteReactComment() {
  return useMutation<ISuccess, IHttpError, IReactCommentPayload>((payload) => {
    return Blog.deleteReactComment(payload).then((res) => res.data);
  });
}
