import { IPaginationQuery, Model, ObjectsFactory } from "../../core";
import { SEARCH_PRODUCT_ENDPOINT } from "../../endpoint";
import { IProduct } from "../../pms";

// Products
export interface ISearchProductQuery extends IPaginationQuery {
  searchTerms: string;
}

export class SearchProduct extends Model {
  static config = { endpoint: SEARCH_PRODUCT_ENDPOINT };

  static objects = ObjectsFactory.factory<IProduct>(SearchProduct.config);
}

SearchProduct.init(SearchProduct.config);
