import { Model, ObjectsFactory } from "@hera/data";
import { UPLOAD_IMAGE_ENDPOINT } from "../../endpoint";

export interface IUploadImagePayload {
  data: FormData;
}

export interface IUploadImageResponse {
  url: string;
}

export class UploadImage extends Model {
  static config = {
    endpoint: UPLOAD_IMAGE_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<IUploadImagePayload>(this.config);
}

UploadImage.init(UploadImage.config);
