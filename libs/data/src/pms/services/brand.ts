import { Brand, IBrand } from "@hera/data";
import { GET_LIST_BRAND_ENDPOINT } from "../../endpoint";

export const getBrandsListService = () => {
  return Brand.objects.find();
};

export const getBrandDetailService = (slug: string) => {
  return Brand.service.get<IBrand>({
    url: `${GET_LIST_BRAND_ENDPOINT}/${slug}`,
  });
};
