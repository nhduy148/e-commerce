import { Model, ObjectsFactory } from "../../core";
import { GET_BANNER_DATA_ENDPOINT } from "../../endpoint";

export interface IBannerContent {
  en: string;
  vn: string;
}

export interface IBannerData {
  content: IBannerContent | string;
  desktopPhotoUrl: string;
  id: number;
  isActive: boolean;
  mobilePhotoUrl: string;
  name: string | null;
  position: string | null;
  priority: number;
  title: string | null;
  url: string;
  subTitle?: string;
  subtitle: string;
}

export interface IBannerDataParam {
  isActive: boolean;
  position: string;
}

export class BannerData extends Model {
  static config = { endpoint: GET_BANNER_DATA_ENDPOINT };

  static objects = ObjectsFactory.factory(BannerData.config);
}

BannerData.init(BannerData.config);
