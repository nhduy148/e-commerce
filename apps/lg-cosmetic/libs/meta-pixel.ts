import { ITaxon } from "@hera/data";
import { CURRENCY } from "@lc/constants";
import { IPurchaseInfo, ITrackingProduct } from "@lc/types";
import dayjs from "dayjs";

type EventType = "ViewContent" | "AddToCart" | "Purchase";

type DataShape = {
  [type in EventType]?: object;
};

const getItemCategories = (taxons: ITaxon[] = []) =>
  (taxons || [])
    .map((cate) => cate?.name)
    .filter(Boolean)
    .join(", ") || "";

export const metaPixelEvent = async (event: EventType, options: object) => {
  const ReactPixel = await import("react-facebook-pixel");
  const content_type = "product";
  const data: DataShape = {
    ViewContent: () => {
      const product = options as ITrackingProduct;
      return {
        content_ids: product?.id,
        content_category: getItemCategories(product?.taxons),
        content_name: product?.name || "",
        currency: CURRENCY,
        content_type,
        value: product?.sellingPrice || 0,
      };
    },
    AddToCart: () => {
      const product = options as ITrackingProduct;
      return {
        content_ids: product?.id,
        content_category: getItemCategories(product?.taxons),
        content_name: product?.name || "",
        currency: CURRENCY,
        content_type,
        value: product?.sellingPrice || 0,
        quantity: product?.quantity || 1,
      };
    },
    Purchase: () => {
      const purchaseInfo = options as IPurchaseInfo;
      const shippingMethod = (purchaseInfo?.packages || []).find(
        (shippingMethod) => shippingMethod.state === "pending",
      );
      const paymentMethod = (purchaseInfo?.payments || []).find(
        (paymentMethod) => paymentMethod.state === "pending",
      );
      return {
        content_type: "product_group",
        content_ids: purchaseInfo.number,
        content_name: "Purchase",
        num_items: purchaseInfo?.lineItems?.length || 1,
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
        currency: CURRENCY,
        value: purchaseInfo?.total || 0,
        total: purchaseInfo?.total || 0,
        sub_total: purchaseInfo?.subTotal || 0,
        discount: purchaseInfo?.promoTotal,
        contents: (purchaseInfo?.lineItems || []).map((lineItem, index) => ({
          content_ids: lineItem?.product?.id,
          content_category: getItemCategories(lineItem?.product?.taxons),
          content_name: lineItem?.product?.name || "",
          currency: CURRENCY,
          content_type,
          value: lineItem?.product?.sellingPrice || 0,
          quantity: lineItem?.quantity || 1,
        })),
      };
    },
  };

  // @ts-ignore
  ReactPixel?.default?.track(event, data[event]());
};
