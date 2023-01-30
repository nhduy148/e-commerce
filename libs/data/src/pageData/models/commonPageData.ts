import { Model, ObjectsFactory } from "../../core";
import { GET_PAGE_DATA_ENDPOINT } from "../../endpoint";

export type IMenuDisplayType = "brand" | "menu" | "link";

export interface IMenu {
  displayType?: IMenuDisplayType;
  text: string;
  type?: string;
  value?: string;
  url?: string;
  rootTaxon?: string;
}

export interface ITopBrands {
  desktopPhotoUrl: string;
  id: number;
  insertedAt: string;
  isActive: boolean;
  mobilePhotoUrl: string;
  name: string | null;
  organizationId: number;
  position: string;
  priority: number;
  updatedAt: string;
  url: string;
}

export interface ITopSearchKeywords {
  href: string;
  image: string;
  text: string;
}

export interface ICommonPageData {
  categoryConfig: IMenu[];
  headerMessage: string | null;
  headerMessageUrl: string | null;
  searchConfig: ITopSearchKeywords[];
  searchTaxonId: number;
  topBannerBackgroundColor: string;
  topBannerDesktopImage: string;
  topBannerMobileImage: string;
  topBrandBanners: ITopBrands[];
}

export class CommonPageData extends Model {
  static config = { endpoint: GET_PAGE_DATA_ENDPOINT };

  static objects = ObjectsFactory.factory<ICommonPageData>(
    CommonPageData.config,
  );
}

// Init model service
CommonPageData.init(CommonPageData.config);
