import { Model, ObjectsFactory } from "../../core";
import { GET_LIST_BRAND_ENDPOINT } from "../../endpoint";

export interface IBrand {
  id: number;
  isActive: boolean;
  listingBannerDesktop: string;
  listingBannerMobile: string;
  name: string;
  slug: string;
  metaDescription?: string;
  metaImg?: string;
}

export class Brand extends Model {
  static config = {
    endpoint: GET_LIST_BRAND_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<IBrand>(this.config);
}

Brand.init(Brand.config);
