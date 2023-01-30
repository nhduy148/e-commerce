import {
  getLoyaltyActiveProgramService,
  getLoyaltyExpiredTimeService,
  getLoyaltyService,
  IActiveProgramResponse,
  IHttpError,
  IPaginateData,
  IProgramExpiredTimeResponse,
  IUserLoyaltyParams,
  IUserLoyaltyResponse,
} from "@hera/data";

import { useQuery } from "react-query";

export const GET_LOYALTY_KEY = "GET_LOYALTY_KEY";
export function useGetLoyaltyQuery(params: IUserLoyaltyParams) {
  return useQuery<IPaginateData<IUserLoyaltyResponse>, IHttpError>({
    queryKey: [GET_LOYALTY_KEY, params],
    queryFn: () => getLoyaltyService(params),
  });
}

export const GET_ACTIVE_PROGRAM_KEY = "GET_ACTIVE_PROGRAM_KEY";
export function useGetActiveProgramQuery() {
  return useQuery<IActiveProgramResponse, IHttpError>({
    queryKey: GET_ACTIVE_PROGRAM_KEY,
    queryFn: getLoyaltyActiveProgramService,
  });
}

export const GET_PROGRAM_EXPIRED_TIME_KEY = "GET_PROGRAM_EXPIRED_TIME-KEY";
export function useGetProgramExpiredTimeQuery() {
  return useQuery<IProgramExpiredTimeResponse, IHttpError>({
    queryKey: GET_PROGRAM_EXPIRED_TIME_KEY,
    queryFn: getLoyaltyExpiredTimeService,
  });
}

export const GET_CURRENT_USER_ENDPOINT = "GET_CURRENT_USER_ENDPOINT";
