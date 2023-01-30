import { IResponse } from "../../core";
import {
  GET_DISTRICTS_ENDPOINT,
  GET_PROVINCES_ENDPOINT,
  GET_WARDS_ENDPOINT,
} from "../../endpoint";
import {
  ILocation,
  ILocationQuery,
  initialLocationValues,
  Location,
} from "../models/location";

export const getLocationService = async (
  { provinceId, districtId, wardId }: ILocationQuery = {
    provinceId: null,
    districtId: null,
    wardId: null,
  },
  getAll: boolean = false,
) => {
  const data = initialLocationValues;
  if (!provinceId || getAll) {
    const { data: provinces } = await Location.service.get<
      IResponse<ILocation[]>
    >({
      url: GET_PROVINCES_ENDPOINT,
    });
    data.provinces = provinces;
  }
  if ((provinceId && !districtId) || getAll) {
    const { data: districts } = await Location.service.get<
      IResponse<ILocation[]>
    >({
      url: GET_DISTRICTS_ENDPOINT,
      params: { provinceId },
    });
    data.districts = districts;
  }
  if ((provinceId && districtId && !wardId) || getAll) {
    const { data: wards } = await Location.service.get<IResponse<ILocation[]>>({
      url: GET_WARDS_ENDPOINT,
      params: { districtId },
    });
    data.wards = wards;
  }

  return data;
};
