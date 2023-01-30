import { IResponse, Model, ObjectsFactory } from "../../core";
import { GET_SAMPLE } from "../../endpoint";

export interface IGetSamplePayload {
  name: string;
  email: string;
  phone: string;
  type: string;
  gestationalAge: string;
  childAge: string;
}
export interface IGetSampleSuccess {
  status: string;
}

export class GetSample extends Model {
  static config = { endpoint: "/get_samples" };

  static objects = ObjectsFactory.factory<GetSample>(this.config);

  /**
   * Login by username (email) and password
   * @param {string} email
   * @param {string} password
   * @return {Promise<T>}
   */

  static getSampleRegister(payload: IGetSamplePayload) {
    return this.service.post<IResponse<IGetSampleSuccess>>({
      url: GET_SAMPLE,
      payload,
    });
  }
}

GetSample.init(GetSample.config);
