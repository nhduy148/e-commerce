import {
  IListProductParams,
  IProduct,
  IProductDetail,
  IProductReviewPayload,
  Product,
} from "@hera/data";
import { useQuery } from "react-query";
import { IHttpError, IPaginateData } from "../../core";

export const LIST_PRODUCT_QUERY = "LIST_PRODUCT_QUERY";
export function useListProduct(params: IListProductParams = {}) {
  return useQuery<IPaginateData<IProduct>, IHttpError>({
    queryKey: [LIST_PRODUCT_QUERY, params],
    queryFn() {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        if (paramValue === undefined || paramValue === null) {
          // @ts-ignore
          delete params[paramKey];
        }
        if (Array.isArray(paramValue)) {
          // @ts-ignore
          params[paramKey] = paramValue?.filter(
            (id) => id !== undefined && id !== null,
          );
        }
      }
      return Product.objects.paginate(params);
    },
  });
}

export const GET_DETAIL_PRODUCT_QUERY = "GET_DETAIL_PRODUCT_QUERY";
export function useGetProductDetail(
  slug: string,
  productsDetails?: IProductDetail,
) {
  return useQuery({
    queryKey: [GET_DETAIL_PRODUCT_QUERY, slug],
    queryFn() {
      return Product.getProductDetails(slug);
    },
    initialData: productsDetails,
    enabled: Boolean(slug),
  });
}

export const GET_RELATED_PRODUCT_QUERY = "GET_RELATED_PRODUCT_QUERY";
export function useGetRelatedProduct(productId: number) {
  return useQuery({
    queryKey: [GET_RELATED_PRODUCT_QUERY, productId],
    queryFn() {
      return Product.getRelatedProducts(productId);
    },
  });
}

export const GET_SHOPINSHOP_PRODUCTS = "GET_SHOPINSHOP_PRODUCTS";
export function useGetShopInShopQuery(brand: string) {
  return useQuery({
    queryKey: [GET_RELATED_PRODUCT_QUERY, brand],
    queryFn() {
      return Product.getShopInShopProducts(brand);
    },
  });
}

export const GET_PRODUCT_REVIEWS = "GET_PRODUCT_REVIEWS";
export function useGetProductReviews(params: IProductReviewPayload) {
  return useQuery({
    queryKey: [GET_PRODUCT_REVIEWS, params],
    queryFn() {
      return Product.getProductReviews(params);
    },
    enabled: !!params.productId,
  });
}

export const SALE_EVENT_RUNNING = "SALE_EVENT_RUNNING";
export function useListRunningSaleEvents() {
  return useQuery({
    queryKey: [SALE_EVENT_RUNNING],
    queryFn() {
      return Product.listRunningSaleEvents();
    },
  });
}
