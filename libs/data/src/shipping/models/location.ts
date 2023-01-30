import { Model, ObjectsFactory } from "../../core";
import { BASE_ENDPOINT } from "../../endpoint";

export interface ILocation {
  code: string;
  id: number;
  name: string;
}

export interface ILocationQuery {
  provinceId: string | null;
  districtId: string | null;
  wardId: string | null;
}

export interface ILocationResponse {
  provinces: ILocation[];
  districts: ILocation[];
  wards: ILocation[];
}

export const initialLocationValues: ILocationResponse = {
  provinces: [],
  districts: [],
  wards: [],
};

export class Location extends Model {
  static config = { endpoint: BASE_ENDPOINT };

  static objects = ObjectsFactory.factory<ILocation>(this.config);
}

Location.init(Location.config);
