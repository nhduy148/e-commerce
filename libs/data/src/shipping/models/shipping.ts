import { Model, ObjectsFactory } from "../../core";
import { SHIPPING_ADDRESS_ENDPOINT } from "../../endpoint";

export interface IShippingInfo {
  addressLine: string;
  district: IAddressPart;
  firstName: string;
  lastName: string;
  fullName: string;
  id: IShippingAddressId;
  isDefault: boolean;
  phone: string;
  province: IAddressPart;
  ward: IAddressPart;
  displayName: string;
}

export interface IShippingInfoPayload {
  id?: IShippingAddressId;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  isDefault: boolean;
  provinceId: string | number;
  districtId: string | number;
  wardId: string | number;
  addressLine: string;
  displayName: string;
}

export type IShippingAddressId = number;

export interface IShippingAndBillingAddressPayload {
  email: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  phone: string;
  note?: string;
  provinceId: string | number;
  province: string;
  districtId: string | number;
  district: string;
  wardId: string | number;
  ward: string;
  id?: IShippingAddressId;
  displayName: string;
}

export const selectShippingAndBillingInitValues: IShippingAndBillingAddressPayload =
  {
    email: "",
    firstName: "",
    lastName: "",
    addressLine1: "",
    phone: "",
    provinceId: "",
    province: "",
    districtId: "",
    district: "",
    wardId: "",
    ward: "",
    displayName: "",
  };

interface IAddressPart {
  code: string;
  id: number;
  name: string;
}

export interface IShippingMethodQuery {
  shippingMethodId: number;
}

export interface IDeleteShippingAddressQuery {
  id: number;
}

export interface IDeleteShippingAddressResponse {
  status: string;
}

export const shippingInfoInitValues: IShippingInfoPayload = {
  isDefault: false,
  addressLine: "",
  firstName: "",
  lastName: "",
  fullName: "",
  phone: "",
  provinceId: "",
  districtId: "",
  wardId: "",
  displayName: "",
};

export class Shipping extends Model {
  static config = { endpoint: SHIPPING_ADDRESS_ENDPOINT };

  static objects = ObjectsFactory.factory<IShippingInfo>(this.config);
}

Shipping.init(Shipping.config);
