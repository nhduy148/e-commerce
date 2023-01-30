import { IResponse, Model, ObjectsFactory } from "@hera/data";
import { GET_STATIC_PAGE_DATA_ENDPOINT } from "../../endpoint";

export interface IStaticPageData {
  id: number;
  content: string;
  insertedAt: string | Date;
  name: string;
  slug: string;
  updatedAt: string | Date;
  desktopPhotoUrl: string;
  mobilePhotoUrl: string;
  shortDescription: string;
}

export interface IStaticPageDataParam {
  slug: string;
}

export class StaticPageData extends Model {
  static config = { endpoint: GET_STATIC_PAGE_DATA_ENDPOINT };
  static objects = ObjectsFactory.factory<IStaticPageData>(
    StaticPageData.config,
  );

  static getStaticPageData({ slug }: IStaticPageDataParam) {
    return this.service.getOne<IResponse<IStaticPageData>>({
      url: GET_STATIC_PAGE_DATA_ENDPOINT,
      urlParams: { slug },
    });
  }
}

// Init model service
StaticPageData.init(StaticPageData.config);
