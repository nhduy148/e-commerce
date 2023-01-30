import { Model, ObjectsFactory } from "../../core";
import { GET_SHOPPING_CART_ENDPOINT } from "../../endpoint";
import { IProduct } from "../../pms";
import { IPaymentState, IPaymentType } from "./payment";

export const SUPPORTED_SHIPPING_METHODS = ["ghn"] as const;
export type SupportedShippingtMethods =
  typeof SUPPORTED_SHIPPING_METHODS[number];

export interface ILineItem {
  id: number;
  label: "gift" | null;
  product: IProduct;
  productId: number;
  quantity: number;
  totalPrice: number;
  totalPriceFinal: number;
  unitPrice: number;
  isOrderable: boolean;
}

export interface ICart {
  deliveryStatus?: null | string;
  deliveryTrackingCode?: null | string;
  id: number;
  itemCount: number;
  lastPayment?: null;
  lineItems: Array<ILineItem>;
  number: string | null;
  promoTotal: number;
  promoCode?: string;
  shippingLabelUrl?: null;
  shippingTotal: number;
  state?: IOrderState;
  subTotal: number;
  total: number;
  billingAddress?: IShippingAndBillingAddressShape;
  shippingAddress?: IShippingAndBillingAddressShape;
  payments?: ICartPayment[];
  valid?: boolean;
}

export interface ICartPayment {
  amount: number;
  id: number;
  orderNumber: string;
  paymentType: IPaymentType;
  state: IPaymentState;
}

export interface IShippingMethod {
  cost: number;
  id: number;
  name: string;
  slug: string;
  originalCost: number;
  shippingCode?: SupportedShippingtMethods;
}

export interface IUpdateNotePayload {
  specialInstructions: string;
}

export interface IShippingAndBillingAddressShape {
  addressLine1: string;
  addressLine2?: string;
  district: string;
  email: string;
  firstName: string;
  lastName: string;
  note?: string;
  phone: string;
  province: string;
  ward: string;
  provinceId: string | number;
  districtId: string | number;
  wardId: string | number;
  displayName: string;
}

export interface IAddToCartPayload {
  orderNumber?: string;
  productId: number;
  quantity: number;
  minInCart?: number;
  maxInCart?: number;
  inStock?: number;
}

export interface IGetShoppingCartQuery {
  orderNumber?: string;
  productId: number;
  quantity: number;
}

export interface IDeleteShoppingCartItemQuery {
  orderNumber?: string;
  id: number;
}

export interface IDeleteShoppingCartItemResponse {
  msg: "ok" | null;
}
export type IOrderState =
  | "cart"
  | "address"
  | "delivery"
  | "payment"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "payment_failed"
  | "pending_confirm"
  | "processing";

export class Cart extends Model {
  static config = {
    endpoint: GET_SHOPPING_CART_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<ICart>(Cart.config);
}

Cart.init(Cart.config);
