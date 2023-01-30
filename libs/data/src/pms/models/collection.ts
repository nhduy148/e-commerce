import { Model, ObjectsFactory } from "@hera/data";
import { GET_COLLECTIONS_LIST_ENDPOINT } from "../../endpoint";

export interface ICollection {
  id: number;
  insertedAt: string | Date;
  isActive: boolean;
  listingBannerDesktop: string;
  listingBannerMobile: string;
  name: string;
  slug: string;
  updatedAt: string | Date;
}

export class Collection extends Model {
  static config = {
    endpoint: GET_COLLECTIONS_LIST_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<ICollection>(this.config);
}

Collection.init(Collection.config);
