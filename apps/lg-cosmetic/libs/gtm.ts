import { ILineItem, IShippingInfo, ITaxon } from "@hera/data";
import { CURRENCY } from "@lc/constants";
import { IPurchaseInfo, ITrackingProduct } from "@lc/types";
import dayjs from "dayjs";
import GTM from "react-gtm-module";

type EventType =
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "view_cart"
  | "add_shipping_info"
  | "purchase";

type DataShape = {
  [type in EventType]?: object;
};

const getItemCategories = (taxons: ITaxon[] = []) => {
  const array = (taxons || []).map((category, index) => ({
    [index === 0 ? "item_category" : "item_category" + (index + 1)]:
      category?.name || "",
  }));

  return array.reduce((obj, item) => {
    const [[key, value]] = Object.entries(item);
    return Object.assign(obj, { [key]: value });
  }, {});
};

export const gtmEvent = (type: EventType, options: object | object[]) => {
  const data: DataShape = {
    add_to_cart: () => {
      const product = options as ITrackingProduct;
      return {
        ecommerce: {
          items: [
            {
              item_id: product?.id || 1,
              item_name: product?.name || "",
              currency: CURRENCY,
              index: 0,
              item_brand: product?.brand?.name || "",
              ...getItemCategories(product?.taxons),
              price: product?.sellingPrice || 0,
              quantity: product?.quantity || 1,
            },
          ],
        },
      };
    },
    select_item: () => {
      const product = options as ITrackingProduct;
      return {
        ecommerce: {
          items: [
            {
              item_id: product?.id || 1,
              item_name: product?.name || "",
              currency: CURRENCY,
              index: 0,
              item_brand: product?.brand?.name || "",
              ...getItemCategories(product?.taxons),
              price: product?.sellingPrice || 0,
            },
          ],
        },
      };
    },
    view_item: () => {
      const product = options as ITrackingProduct;
      return {
        ecommerce: {
          items: [
            {
              item_id: product?.id || 1,
              item_name: product?.name || "",
              currency: CURRENCY,
              index: 0,
              item_brand: product?.brand?.name || "",
              ...getItemCategories(product?.taxons),
              price: product?.sellingPrice || 0,
            },
          ],
        },
      };
    },
    view_cart: () => {
      const products = options as ILineItem[];
      return {
        ecommerce: {
          items: products.map((lineItem, index) => ({
            item_id: lineItem?.product?.id || 1,
            item_name: lineItem?.product?.name || "",
            currency: CURRENCY,
            index,
            item_brand: lineItem?.product?.brand?.name || "",
            ...getItemCategories(lineItem?.product?.taxons),
            price: lineItem?.product?.sellingPrice || 0,
            quantity: lineItem?.quantity,
          })),
        },
      };
    },
    add_shipping_info: () => {
      const shippingInfo = options as IShippingInfo;
      return { ecommerce: { ...shippingInfo } };
    },
    purchase: () => {
      const purchaseInfo = options as IPurchaseInfo;
      const shippingMethod = (purchaseInfo?.packages || []).find(
        (shippingMethod) => shippingMethod.state === "pending",
      );
      const paymentMethod = (purchaseInfo?.payments || []).find(
        (paymentMethod) => paymentMethod.state === "pending",
      );
      return {
        ecommerce: {
          transaction_id: purchaseInfo.number,
          shipping_address: purchaseInfo?.shippingAddress,
          promotion_code: purchaseInfo?.promoCode || "",
          created_at: dayjs(purchaseInfo?.insertedAt).format(
            "DD/MM/YYYY HH:mm:ss",
          ),
          shipping_method: {
            discount: shippingMethod?.shippingDiscount || 0,
            name: shippingMethod?.shippingMethod?.name || "",
            cost: shippingMethod?.shippingMethod?.cost || 0,
          },
          payment_method: {
            name: paymentMethod?.paymentType || "",
            amount: paymentMethod?.amount || 0,
          },
          total: purchaseInfo?.total || 0,
          sub_total: purchaseInfo?.subTotal || 0,
          discount: purchaseInfo?.promoTotal,
          items: (purchaseInfo?.lineItems || []).map((lineItem, index) => ({
            item_id: lineItem?.product?.id || 1,
            item_name: lineItem?.product?.name || "",
            currency: CURRENCY,
            index,
            item_brand: lineItem?.product?.brand?.name || "",
            ...getItemCategories(lineItem?.product?.taxons),
            price: lineItem?.product?.sellingPrice || 0,
            quantity: lineItem?.quantity,
          })),
        },
      };
    },
  };

  GTM.dataLayer({
    dataLayer: {
      event: type,
      // @ts-ignore
      ...data[type](),
    },
  });
};
