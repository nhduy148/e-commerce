import { Model, ObjectsFactory } from "../../core";
import { GET_LIST_TAXONS_ENDPOINT } from "../../endpoint";

export interface IDetailTaxonItem {
  displayName: string;
  id: number;
  isActive: boolean;
  name: string;
  priority: string;
  slug: string;
}
export interface IBreadcrumbItems {
  name: string;
  slug: string;
  type: string;
}

export interface IDetailTaxon {
  breadcrumbs: Array<IBreadcrumbItems>;
  children: Array<IDetailTaxonItem>;
  displayName: string;
  id: number;
  isActive: true;
  listingBannerDesktop: string;
  listingBannerMobile: string;
  name: string;
  parent: Array<IDetailTaxonItem>;
  priority: string;
  slug: string;
  metaDescription?: string;
  metaImg?: string;
}

export class Taxon extends Model {
  static config = {
    endpoint: GET_LIST_TAXONS_ENDPOINT,
  };

  static objects = ObjectsFactory.factory(this.config);

  static getListDetailTaxon(slug: string) {
    return this.service.get<IDetailTaxon>({
      url: `${GET_LIST_TAXONS_ENDPOINT}/${slug}`,
    });
  }
}

Taxon.init(Taxon.config);
