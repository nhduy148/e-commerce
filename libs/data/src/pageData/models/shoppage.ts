import { ReactNode } from "react";
import { IResponse, Model, ObjectsFactory } from "../../core";
import { SHOPINSHOP_ENDPOINT } from "../../endpoint";
import { IProduct } from "../../pms";
import { IMainBanner, ISlider } from "./homePageData";

export type IShoppageHomepageType =
  | "slider"
  | "block_product"
  | "block_banner"
  | "product_slider"
  | "banner"
  | "block_brand";

export type IShoppageComponent = {
  [type in IShoppageHomepageType]?: JSX.Element | ReactNode;
};

export interface IShoppageBrand {
  products: IProduct[];
  activeImage: string;
  bannerImage?: string;
  bannerImageMobile?: string;
  inactiveImage: string;
  name: string;
}

export type IShoppageSection = {
  banners: IMainBanner[] | null;
  id: number;
  posts: any | null;
  products: IProduct[] | null;
  showTitle: boolean;
  title: string;
  type: IShoppageHomepageType;
  bannerImage?: string;
  slider?: ISlider | null;
  brands?: IShoppageBrand[];
};

export interface IShoppage {
  content: IShoppageSection[];
  seoMeta?: any | null;
  slug?: string;
  title?: string;
}

export class ShopInShop extends Model {
  static config = { endpoint: SHOPINSHOP_ENDPOINT };

  static objects = ObjectsFactory.factory<IResponse<IShoppage>>(
    ShopInShop.config,
  );
}

// Init model service
ShopInShop.init(ShopInShop.config);
