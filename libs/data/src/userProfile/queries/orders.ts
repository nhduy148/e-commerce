import { IUserOrder, UserProfile } from "@hera/data";
import { useQuery } from "react-query";
import { IHttpError, IPaginateData, IPaginationQuery } from "../../core";

export const USER_ORDERS = "USER_ORDERS";

export function useUserOrders(params: IPaginationQuery) {
  return useQuery<IPaginateData<IUserOrder>, IHttpError>({
    queryKey: [USER_ORDERS, params],
    queryFn() {
      return UserProfile.getUserOrders(params);
    },
  });
}
