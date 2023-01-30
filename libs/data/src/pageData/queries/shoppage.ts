import { useQuery } from "react-query";
import { IResponse } from "../../core";
import { IShoppage, ShopInShop } from "../models";

export const GET_SHOPPAGE = "GET_SHOPPAGE";
export function useShopInShop(slug: string) {
  return useQuery({
    queryKey: [GET_SHOPPAGE, slug],
    queryFn() {
      return ShopInShop.service.getOne<IResponse<IShoppage>>({
        url: ShopInShop.config.endpoint,
        urlParams: { slug },
      });
    },
  });
}
