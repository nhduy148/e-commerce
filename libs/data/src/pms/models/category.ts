import { Model, ObjectsFactory } from "@hera/data";
import { GET_LIST_CATEGORY_ENDPOINT } from "../../endpoint";

export interface IAllCategories {
  categories: { root: ICategory; name: string; id: number };
}
export interface ICategory {
  id: number;
  imageUrl: string;
  isActive: boolean;
  listingBannerDesktop: null | string;
  listingBannerMobile: null | string;
  menuBanner: null | string;
  name: string;
  parentId: number;
  permlink: string;
  prettyName: string;
  slug: string;
  taxonomyId: number;
  taxons?: ICategory[];
}

export class Category extends Model {
  static config = {
    endpoint: GET_LIST_CATEGORY_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<ICategory>(this.config);
}

Category.init(Category.config);
