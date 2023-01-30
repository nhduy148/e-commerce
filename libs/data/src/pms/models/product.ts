import { IProductSurveyForm, IReviewReply } from "@hera/data";
import { sentryErrorBoundary } from "@hera/utils";
import { IUserCommentItem } from "../../blog";
import {
  IPaginateData,
  IPaginationQuery,
  IResponse,
  Model,
  ObjectsFactory,
} from "../../core";
import {
  CREATE_REVIEW_ENDPOINT,
  PRODUCT_ENDPOINT,
  PRODUCT_REVIEW_ENDPOINT_2,
  SALE_EVENT_RUNNING,
  SHOPINSHOP_ENDPOINT,
} from "../../endpoint";
import { IBrand } from "./brand";
import { ICategory } from "./category";

export interface IProductImage {
  isDefault: boolean;
  large: string;
  original: string;
  small: string;
  thumb: string;
  placeholder?: string;
}

export interface IProductDefaultImage {
  defaultProductUrl: string;
}

export interface IRatingSummary {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface IProduct {
  alreadyWishlist: boolean;
  brand: IBrand;
  category: ICategory;
  currentSaleEvent: ICurrentSaleEventItem;
  currentSaleEventProduct: ICurrentSaleEventProduct;
  defaultImage: IProductDefaultImage;
  description: string | null;
  id: number;
  images: Array<IProductImage>;
  inStock: number;
  maxInCart: number;
  maxRetailPrice: number;
  metaDescription: string | null;
  metaKeywords: null;
  metaTitle: null;
  minInCart: 1;
  name: string;
  promotions: null;
  ratingAvg: string | number;
  ratingSummary: IRatingSummary;
  sellingPrice: number;
  sku: string | number;
  slug: string;
  taxons: Array<ITaxon>;
}

export interface IListProductParams extends IPaginationQuery {
  brandIds?: number[];
  sku?: string[];
  taxonIds?: number[];
  prices?: number[];
  isVariant?: boolean;
  onSale?: boolean;
  saleEventIds?: number[];
}

export interface ITaxon {
  id: number;
  name: string;
  slug: string;
}

export interface IImgSize {
  isDefault: boolean;
  large: string;
  original: string;
  small: string;
  thumb: string;
}

export interface IBreadcrumb {
  name: string;
  slug?: string;
  type?: string;
  url?: string;
}

export interface IProductDetailTaxonsItem {
  displayName: string;
  id: number;
  isActive: boolean;
  name: string;
  priority: string;
  slug: string;
}
export interface ICurrentSaleEventItem {
  endAt: string;
  eventType: string;
  id: number;
  isActive: boolean;
  name: string;
  startAt: string;
}
export interface ICurrentSaleEventProduct {
  id: number;
  price: number;
  priority: number;
  sellingPrice: number;
  usageCount: number;
  usageLimit: number;
}
export interface IProductDetail {
  alreadyWishlist: boolean;
  brand: IBrand;
  brandId: number;
  breadcrumbs: Array<IBreadcrumb>;
  canReview: boolean;
  currentSaleEvent: ICurrentSaleEventItem;
  currentSaleEventProduct: ICurrentSaleEventProduct;
  depth: number;
  description: string;
  height: number;
  id: number;
  images: IImgSize[];
  isActive: boolean;
  inStock: number | null;
  maxInCart: number;
  maxRetailPrice: number;
  minInCart: number;
  name: string;
  parentId: number;
  position: number;
  productType: any;
  ratingAvg: number;
  ratingSummary: object;
  sellingPrice: number;
  sku: string;
  slug: string;
  state: any;
  taxons: Array<IProductDetailTaxonsItem>;
  weight: number;
  width: number;
  madeIn: string;
  shortDescription: string;
  questionForm?: IProductSurveyForm;
}
export interface IItemDisplay {
  desktop: number;
  mobile: number;
}

export interface IBannerItem {
  desktopImage: string;
}

export interface IShopInShopContentItem {
  bannerImage?: string;
  products: IProduct[];
  datasource: string;
  desktopImage: string;
  displayItem: IItemDisplay;
  id: number;
  showTitle: boolean;
  type: string;
  title: string;
  banners: IBannerItem[];
}

export interface IShopInShopContent {
  content: IShopInShopContentItem[];
  seoMeta: string;
  slug: string;
  title: string;
}
export interface IShopInShopData<T> {
  data: T;
}

export interface IProductReviewPayload extends IPaginationQuery {
  productId: number;
  reviewId: number;
  sortBy: string;
}
export interface IProductReviewItem {
  content: string;
  id: number;
  insertedAt: number;
  point: 5;
  replyReviews: IReviewReply[];
  user: IUserCommentItem;
  visible: boolean;
  product: IProduct;
  images: IReviewImage[];
}

export interface IReviewImage {
  id: number;
  imageOriginalUrl: string;
  imageRawUrl: string;
  imageThumbUrl: string;
}

export interface ICreateCommentPayload {
  productId: number;
  data: FormData;
}
export class Product extends Model {
  static config = {
    endpoint: PRODUCT_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<IProduct>(this.config);

  static listProduct(params: IListProductParams) {
    const sentry = sentryErrorBoundary({
      name: "listProduct",
      type: "Page Data",
      data: params,
    });
    const response = this.service.get<IPaginateData<IProduct>>({
      url: PRODUCT_ENDPOINT,
      params,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static getProductDetails(slug: string) {
    const sentry = sentryErrorBoundary({
      name: "getProductDetails",
      type: "Page Data",
      data: { slug },
    });
    const response = this.service.get<IProductDetail>({
      url: `${PRODUCT_ENDPOINT}/${slug}`,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static getRelatedProducts(productId: number) {
    const sentry = sentryErrorBoundary({
      name: "getRelatedProducts",
      type: "Page Data",
      data: { productId },
    });
    const response = this.service.get<IPaginateData<IProduct>>({
      url: `${PRODUCT_ENDPOINT}/${productId}/related_products`,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static getShopInShopProducts(brand: string) {
    const sentry = sentryErrorBoundary({
      name: "getShopInShopProducts",
      type: "Page Data",
      data: { slug: brand },
    });
    const response = this.service.getOne<IShopInShopData<IShopInShopContent>>({
      url: SHOPINSHOP_ENDPOINT,
      urlParams: { slug: brand },
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static getProductReviews(params: IProductReviewPayload) {
    const sentry = sentryErrorBoundary({
      name: "getProductReviews",
      type: "Page Data",
      data: params,
    });

    const response = this.service.get<IPaginateData<IProductReviewItem>>({
      url: PRODUCT_REVIEW_ENDPOINT_2,
      params,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static commentPost(productId: number, payload: FormData) {
    const sentry = sentryErrorBoundary({
      name: "commentPost",
      type: "Page Data",
      data: { productId, ...JSON.parse(JSON.stringify(payload)) },
    });
    const response = this.service.upload<IResponse<IProductReviewItem>>(
      payload,
      `${CREATE_REVIEW_ENDPOINT}/${productId}/reviews`,
    );
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static listRunningSaleEvents() {
    const sentry = sentryErrorBoundary({
      name: "listRunningSaleEvents",
      type: "Page Data",
    });
    const response = this.service.get<IResponse<IProduct[]>>({
      url: SALE_EVENT_RUNNING,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }
}

Product.init(Product.config);
