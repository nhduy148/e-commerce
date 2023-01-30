import { Model, ObjectsFactory } from "../../core";
import { SEARCH_KEYWORD_ENDPOINT } from "../../endpoint";

export interface ISearchKeyword {
  id: number;
  keyword: string;
}

export interface ISearchKeywordQuery {
  searchTerms: string;
}

export class SearchKeyword extends Model {
  static config = { endpoint: SEARCH_KEYWORD_ENDPOINT };

  static objects = ObjectsFactory.factory<ISearchKeyword>(SearchKeyword.config);
}

SearchKeyword.init(SearchKeyword.config);
