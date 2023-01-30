import { SupportedPaymentMethods, SupportedShippingtMethods } from "@hera/data";
import { StaticImageSource } from "@lc/static/images";
import { ITypographyFontSize } from "@lc/types";

export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_HTML_FONTSIZE = 16;
export const COEF: number = DEFAULT_FONT_SIZE / 14;

export function pxToRem(size: number) {
  return `${(size / DEFAULT_HTML_FONTSIZE) * COEF}rem`;
}

export const DEFAULT_FONT_NAME = "Roboto";
export const FONT_FAMILIES: string[] = [DEFAULT_FONT_NAME, "sans-serif"];

interface ILGCTypographyFontSize extends ITypographyFontSize {
  title: number;
  titleMobile?: number;
  buttonSm: number;
}

export const DESKTOP_FONTSIZE: ILGCTypographyFontSize = {
  h1: 64,
  h2: 56,
  h3: 48,
  h4: 32,
  h5: 24,
  h6: 16,
  button: 16,
  buttonSm: 14,
  title: 20,
  titleMobile: 16,
  subtitle1: 16,
  subtitle2: 14,
  body1: 16,
  body2: 14,
  caption: 13,
  overline: 12,
};

export const BREAK_POINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export const FONT_WEIGHT_LIGHT = 300;
export const FONT_WEIGHT_REGULAR = 400;
export const FONT_WEIGHT_MEDIUM = 500;
export const FONT_WEIGHT_BOLD = 700;

export const DARK_PRIMARY_COLOR = "#C70752";
export const DARK_PRIMARY_COLOR_LIGHTEN = "#CC0041";
export const DARK_PRIMARY_COLOR_DARKEN = "#A10B4C";
export const DARK_SECONDARY_COLOR = "#3498DB";

export const LIGHT_PRIMARY_COLOR = "#C70752";
export const LIGHT_PRIMARY_COLOR_LIGHTEN = "#CC0041";
export const LIGHT_PRIMARY_COLOR_DARKEN = "#A10B4C";
export const LIGHT_SECONDARY_COLOR = "#3498DB";

export const LIGHT_ACTIVE_COLOR = "#424242";
export const BUTTON_COLOR = "#FAFAFA";
export const BUTTON_CONTAINED_INHERIT_COLOR = "#A6A6A6";
export const BUTTON_CONTAINED_INHERIT_BACKGROUND_COLOR = "#EEEEEE";
export const SECONDARY_TEXT_COLOR = "#666666";
export const PRIMARY_TEXT_COLOR = "#333333";
export const DISABLED_TEXT_COLOR = "rgba(0, 0, 0, 0.38)";

export const DEFAULT_PRODUCT_PER_PAGE_DESKTOP = 20;
export const DEFAULT_PRODUCT_PER_PAGE_TABLET = 20;
export const DEFAULT_PRODUCT_PER_PAGE_MOBILE = 10;

type IPaymentMethod = {
  name: string;
  image?: StaticImageSource;
};
export type IPaymentMethodMapping = {
  [key in SupportedPaymentMethods]: IPaymentMethod & {
    subPaymentMethods?: IPaymentMethod[];
  };
};
export const PAYMENT_METHOD_MAPPING: IPaymentMethodMapping = {
  cod: {
    name: "Thanh toán khi nhận hàng",
    image: "PaymentCOD",
  },
  momo: {
    name: "Ví momo",
    image: "PaymentMomo",
  },
  baokim: {
    name: "Thanh toán Bảo Kim",
    image: "PaymentBaoKim",
    subPaymentMethods: [
      {
        name: "Thẻ ATM",
        image: "PaymentATM",
      },
      {
        name: "Visa/Master",
        image: "PaymentVisa",
      },
    ],
  },
};

export type IShippingMethodMapping = {
  [key in SupportedShippingtMethods]: {
    name: string;
    image?: StaticImageSource;
  };
};
export const SHIPPING_METHOD_MAPPING: IShippingMethodMapping = {
  ghn: {
    name: "Giao hàng nhanh",
    image: "FastDelivery",
  },
};

export const USER_ORDER_DAY_FORMAT = "DD/MM YYYY";
export const CURRENCY = "VND";

export const USER_ACCOUNT_PAGE_SIZE = 4;

export const IMAGE_MAX_SIZE = 5000000; // Bytes
export const REVIEW_IMAGES_TOTAL_SIZE = 10000000; // Bytes
