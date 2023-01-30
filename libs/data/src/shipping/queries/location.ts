import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import {
  ILocationQuery,
  ILocationResponse,
  initialLocationValues,
} from "../models";
import { getLocationService } from "../services";

export const GET_LOCATION_KEY = "GET_LOCATION_KEY";
export function useGetLocation(params: ILocationQuery, getAll: boolean) {
  return useQuery<ILocationResponse, IHttpError>({
    queryKey: [GET_LOCATION_KEY, params],
    queryFn: () => getLocationService(params, getAll),
    initialData: initialLocationValues,
  });
}
