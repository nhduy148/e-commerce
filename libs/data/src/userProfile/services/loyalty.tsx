import {
  IActiveProgramResponse,
  IPaginateData,
  IProgramExpiredTimeResponse,
  IUserLoyaltyParams,
  IUserLoyaltyResponse,
  User,
} from "@hera/data";
import {
  ACTIVE_LOYALTY_ENDPOINT,
  LOYALTY_ENDPOINT,
  LOYALTY_EXPIRED_TIME,
} from "../../endpoint";

export const getLoyaltyService = (params: IUserLoyaltyParams) => {
  return User.service.get<IPaginateData<IUserLoyaltyResponse>>({
    url: LOYALTY_ENDPOINT,
    params,
  });
};

export const getLoyaltyActiveProgramService = () => {
  return User.service.get<IActiveProgramResponse>({
    url: ACTIVE_LOYALTY_ENDPOINT,
  });
};

export const getLoyaltyExpiredTimeService = () => {
  return User.service.get<IProgramExpiredTimeResponse>({
    url: LOYALTY_EXPIRED_TIME,
  });
};
