import { IResponseLanguage } from "@hera/types";
import { Model, ObjectsFactory } from "../../core";
import { GET_HOME_PAGE_DATA_ENDPOINT } from "../../endpoint";

export interface IBannerObject {
  large: string;
  medium: string;
  placeholder: string;
  small: string;
}

export interface IMainBanner {
  desktopImageUrl?: string | IBannerObject;
  mobileImageUrl?: string | IBannerObject;
  desktopPhotoUrl?: string | IBannerObject;
  mobilePhotoUrl?: string | IBannerObject;
  desktopImage?: string | IBannerObject;
  mobileImage?: string | IBannerObject;
  listingBannerDesktop?: string | IBannerObject;
  listingBannerMobile?: string | IBannerObject;
  bannerImage?: string | IBannerObject;
  bannerImageMobile?: string | IBannerObject;
  url?: string;
  id?: number;
  insertedAt?: string | Date;
  isActive?: boolean;
  name?: string | null;
  organizationId?: number;
  position?: string;
  priority?: number;
  updatedAt?: string;
  subTitle?: string;
  title?: string;
  content?: IResponseLanguage;
  imageLabel?: string;
}

export interface IPageTaxon {
  chilrend?: string;
  displayName?: string;
  id: number;
  insertedAt?: string;
  isActive?: boolean;
  lft?: number;
  listingBannerDesktop?: string;
  listingBannerMobile?: string;
  name?: string;
  organizationId?: number;
  parentId?: number;
  rgt?: number;
  slug: string;
  taxonomyId?: number;
  tenant?: string;
  updatedAt?: string;
}

export interface IFlashSale {
  endAt: string;
  eventType: string;
  id: number;
  insertedAt: string;
  isActive: true;
  name: string;
  organizationId: number;
  productCount: null | number;
  startAt: string;
  updatedAt: string;
}

export interface IHomePageData {
  mainBanners: IMainBanner[];
  collection: IPageTaxon;
  flashSales: IFlashSale[];
  giftTaxon: IPageTaxon;
}

export interface ISliderItem {
  id: number;
  desktopImage: string;
  label: string | null;
  link: string;
  mobileImage: string;
  priority: number;
  color?: string | null;
}

export interface ISlider {
  id: number;
  isActive: boolean;
  name?: string;
  position?: string;
  sliderItems: ISliderItem[];
}

export class HomePageData extends Model {
  static config = { endpoint: GET_HOME_PAGE_DATA_ENDPOINT };

  static objects = ObjectsFactory.factory<IHomePageData>(HomePageData.config);
}

// Init model service
HomePageData.init(HomePageData.config);
