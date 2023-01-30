import {
  IResponseWithStatus,
  IUploadImagePayload,
  IUploadImageResponse,
  UploadImage,
} from "@hera/data";

export const uploadImageService = (payload: IUploadImagePayload) => {
  return UploadImage.service.upload<IResponseWithStatus<IUploadImageResponse>>(
    payload.data,
  );
};
