import { Model, ObjectsFactory } from "../../core";
import { GET_LIST_PAYMENT_METHOD_ENDPOINT } from "../../endpoint";

export const SUPPORTED_PAYMENT_METHODS = ["cod", "momo", "baokim"] as const;
export type SupportedPaymentMethods = typeof SUPPORTED_PAYMENT_METHODS[number];
export interface IPaymentMethod {
  active?: boolean;
  code: string;
  description?: string | null;
  id: number;
  liveMode?: boolean;
  name: string;
  paymentCode?: SupportedPaymentMethods;
}

export interface IPaymentMethodQuery {
  paymentMethodId: number;
}

export interface IProcessPaymentQuery {
  paymentId: number;
}

export interface IProcessPaymentPayload {
  platform: IPaymentPlatform;
  callbackUrl?: string;
  trackingCode?: string;
}

export type IPaymentPlatform = "momo_app" | "momo_web" | "web" | "baokim";
export type IPaymentStatus = "processing" | "success" | "failed";
export interface ILastPayment {
  orderNumber: string | null;
  paymentId: string | null;
  status: "success" | "failed";
}

/*
 *  '0': completed (hoàn thành, đã thanh toán thành công)
 *  '49': destructed (hủy thanh toán)
 */
export const MomoPaymentStatus = ["0", "49"] as const;

/*
 *  '0': completed (hoàn thành, đã thanh toán thành công)
 *  '49': destructed (hủy thanh toán)
 */
export type IMomoPaymentStatusCode = typeof MomoPaymentStatus[number];

/*
 *    'p': processing (đang xử lý)
 *    'c': completed (hoàn thành, đã thanh toán thành công)
 *    'r': reviewing (khách đã thanh toán, nhưng tiền chờ duyệt, áp dụng đối với 1 số thẻ visa, rất ít)
 *    'd': destructed (hủy thanh toán, hủy duyệt tiền thanh toán visa)
 */
export const BaoKimPaymentStatus = ["p", "c", "r", "d"] as const;

/*
 *    'p': processing (đang xử lý)
 *    'c': completed (hoàn thành, đã thanh toán thành công)
 *    'r': reviewing (khách đã thanh toán, nhưng tiền chờ duyệt, áp dụng đối với 1 số thẻ visa, rất ít)
 *    'd': destructed (hủy thanh toán, hủy duyệt tiền thanh toán visa)
 */
export type IBaoKimPaymentStatusCode = typeof BaoKimPaymentStatus[number];

export interface IProcessPaymentCallbackPayload {
  paymentId: number;
}

export interface IProcessPaymentClientPayload
  extends IProcessPaymentQuery,
    IProcessPaymentPayload {}

export type IPaymentType = "cod" | "hpm";
export type IPaymentState =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partial_refunded";
export interface IProcessPaymentResponse {
  action: "redirect" | "next";
  orderId: number;
  orderNumber: string;
  url?: string;
}

export interface IMomoPaymentResponse {
  amount: number;
  id: number;
  orderNumber: string;
  paymentType: IPaymentType;
  state: IPaymentState;
}

export class Payment extends Model {
  static config = {
    endpoint: GET_LIST_PAYMENT_METHOD_ENDPOINT,
  };

  static objects = ObjectsFactory.factory<IPaymentMethod>(Payment.config);
}

Payment.init(Payment.config);
