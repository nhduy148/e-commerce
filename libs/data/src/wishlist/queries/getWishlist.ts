import { useQuery } from "react-query";
import { IHttpError, IPaginateData } from "../../core";
import { IGetWishlistQuery, IWishlistData, Wishlist } from "../models";
export const USER_WISHLIST = "USER_WISHLIST";
export function useUserWishlist(
  isLogin?: boolean,
  params: IGetWishlistQuery = {},
) {
  return useQuery<IPaginateData<IWishlistData>, IHttpError>({
    queryKey: [USER_WISHLIST, params],
    queryFn: () => Wishlist.get(params),
    enabled: isLogin,
  });
}
