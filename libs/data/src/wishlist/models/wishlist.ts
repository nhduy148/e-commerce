import { IProduct } from "@hera/data";
import { sentryErrorBoundary } from "@hera/utils";
import { IPaginationQuery, IResponse, Model, ObjectsFactory } from "../../core";
import { BASE_WISHLIST_ENDPOINT } from "../../endpoint";

export interface IUserWishlist {
  id: number;
  product: IProduct;
  productId: number;
}

export interface IAddWishlistResponse {
  id: number;
  product: IProduct | null;
  productId: number;
}

export interface IRemoveWishlistResponse {
  status: string;
}

export interface IRemoveWishlistQuery {
  id: number;
}

export interface IAddWishlistPayload {
  id: number;
}

export interface IGetWishlistQuery extends IPaginationQuery {}

export interface IWishlistData {
  id: number;
  product: IProduct;
  productId: number;
}

export class Wishlist extends Model {
  static config = { endpoint: BASE_WISHLIST_ENDPOINT };

  static objects = ObjectsFactory.factory<IWishlistData>(Wishlist.config);

  static get(params: IGetWishlistQuery = {}) {
    const sentry = sentryErrorBoundary({
      name: "Get Wishlist",
      type: "Wishlist",
      data: params,
    });
    const response = this.objects.paginate(params);
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static add(payload: IAddWishlistPayload) {
    const sentry = sentryErrorBoundary({
      name: "Add Wishlist",
      type: "Wishlist",
      data: payload,
    });

    const response = this.service.post<IResponse<IAddWishlistResponse>>({
      url: `${BASE_WISHLIST_ENDPOINT}/${payload.id}`,
      payload: {},
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static remove(query: IRemoveWishlistQuery) {
    const sentry = sentryErrorBoundary({
      name: "Remove Wishlist",
      type: "Wishlist",
      data: query,
    });

    const response = this.objects.delete<IRemoveWishlistResponse>(query.id);
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }
}

Wishlist.init(Wishlist.config);
