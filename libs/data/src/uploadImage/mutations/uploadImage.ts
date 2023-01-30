import {
  IHttpError,
  IResponseWithStatus,
  IUploadImagePayload,
  IUploadImageResponse,
  uploadImageService,
} from "@hera/data";
import { useMutation } from "react-query";

export function useUploadImageMutation() {
  return useMutation<
    IResponseWithStatus<IUploadImageResponse>,
    IHttpError,
    IUploadImagePayload
  >(uploadImageService);
}
