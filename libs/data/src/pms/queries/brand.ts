import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { IBrand } from "../models/brand";
import { getBrandDetailService, getBrandsListService } from "../services";

export const LIST_BRANDS = "LIST_BRANDS";
export function useListBrands() {
  return useQuery<IBrand[], IHttpError>({
    queryKey: [LIST_BRANDS],
    queryFn: getBrandsListService,
  });
}

export const DETAIL_BRAND = "DETAIL_BRAND";
export function useDetailBrand(slug: string, brandDetails?: IBrand) {
  return useQuery<IBrand, IHttpError>({
    queryKey: [DETAIL_BRAND, slug],
    queryFn: () => getBrandDetailService(slug),
    initialData: brandDetails,
  });
}
