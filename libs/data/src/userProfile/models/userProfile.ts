import { IProduct, IShippingAndBillingAddressShape } from "@hera/data";
import { sentryErrorBoundary } from "@hera/utils";
import {
  IPaginateData,
  IPaginationQuery,
  Model,
  ObjectsFactory,
} from "../../core";
import { GET_ORDERS_ENDPOINT } from "../../endpoint";

export interface IUserOrderLineItem {
  label: string;
  quantity: number;
  totalPrice: number;
  product: IProduct;
  id: number;
}

export interface IUserOrderShippingMethod {
  cost: number;
  id: number;
  name: string;
  slug: string;
}

export interface IUserOrderPackage {
  cost: number;
  id: number;
  number: string;
  shipByDate: Date;
  shippingDiscount: number;
  shippingMethod: IUserOrderShippingMethod;
  state: string;
  tracking: string | null | boolean;
}

export interface IUserOrderShippingAddress
  extends Omit<IShippingAndBillingAddressShape, "addressLine"> {
  addressLine1: string;
  addressLine2: string;
}

export interface IUserOrder {
  completedAt: Date | null;
  insertedAt: Date;
  billingAddress: string;
  deliveryStatus: null | string;
  deliveryTrackingCode: string | number;
  id: number;
  itemCount: number;
  lastPayment: string;
  lineItems: IUserOrderLineItem[];
  packages: IUserOrderPackage[];
  number: string;
  payments: string[];
  promoTotal: number;
  shippingAddress: IUserOrderShippingAddress;
  shippingLabelUrl: string;
  shippingTotal: 0;
  subTotal: number;
  total: number;
  state:
    | "payment"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "payment_failed"
    | "pending_confirm"
    | "processing"
    | string;
}

export interface IAdminInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
export interface IUserLoyaltyResponse {
  id: number;
  datetimeUpdate: string | Date;
  pointAfterUpdate: number;
  pointBeforeUpdate: number;
  pointUpdate: number;
  admin: IAdminInfo;
  reasonUpdate: string;
}

export interface IUserLoyaltyParams {
  userId: number | string;
  page?: number;
  size?: number;
}

export interface IActiveProgramResponse {
  data: {
    msg: string;
  };
  status: string;
}

export interface IProgramExpiredTimeResponse extends IActiveProgramResponse {}

export class UserProfile extends Model {
  static config = { endpoint: "/users" };

  static objects = ObjectsFactory.factory<UserProfile>(UserProfile.config);

  static getUserOrders(params: IPaginationQuery) {
    const sentry = sentryErrorBoundary({
      name: "getUserOrders",
      type: "Profile",
      data: params,
    });
    const response = this.service.get<IPaginateData<IUserOrder>>({
      url: GET_ORDERS_ENDPOINT,
      params,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }
}

UserProfile.init(UserProfile.config);
