import { SupportedPaymentMethods, SupportedShippingtMethods } from "@hera/data";
import { StaticImageSource } from "@nestle/static/images";
import { ITypographyFontSize } from "@nestle/types";

export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_HTML_FONTSIZE = 16;
export const COEF: number = DEFAULT_FONT_SIZE / 14;

export function pxToRem(size: number) {
  return `${(size / DEFAULT_HTML_FONTSIZE) * COEF}rem`;
}

export const DEFAULT_FONT_NAME = "Roboto";
export const FONT_FAMILIES: string[] = [DEFAULT_FONT_NAME, "sans-serif"];

interface ILGCTypographyFontSize extends ITypographyFontSize {
  buttonLg: number;
  buttonSm: number;
  inputLabel: number;
  helperText: number;
  inputText: number;
  avatarInitial: number;
  chip: number;
  tooltip: number;
  alertTitle: number;
  tableHeader: number;
  badgeLabel: number;
}

export const DESKTOP_FONTSIZE: ILGCTypographyFontSize = {
  h1: 96,
  h2: 60,
  h3: 48,
  h4: 34,
  h5: 24,
  h6: 20,
  button: 14,
  subtitle1: 16,
  subtitle2: 14,
  body1: 16,
  body2: 14,
  caption: 12,
  overline: 12,
  // custom
  buttonLg: 16,
  buttonSm: 12,
  inputLabel: 12,
  helperText: 12,
  inputText: 14,
  avatarInitial: 20,
  chip: 13,
  tooltip: 10,
  alertTitle: 16,
  tableHeader: 14,
  badgeLabel: 12,
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

export const BORDER_RADIUS = 6;

export const PRIMARY_BLUR_COLOR = "#EEECE9";
export const PRIMARY_BACKGROUND_COLOR = "#FFF7EC";
export const SECONDARY_BACKGROUND = "#FFFBF4";
export const PRIMARY_BORDER_COLOR = "#E5E9F2";
export const SECONDARY_BORDER_COLOR = "rgba(178, 152, 118, 0.15)";
export const HOME_BANNER_ARROW_BACKGROUND = "#EAE8E8";
export const FOOTER_BACKGROUND = "#F9F9F9";

// Primary Colors
export const PRIMARY_COLOR = "#63513D";
export const PRIMARY_COLOR_LIGHTEN = "#827363";
export const PRIMARY_COLOR_DARKEN = "#45382A";
export const PRIMARY_COLOR_CONSTRAST = "#FFFFFF";
export const PRIMARY_CONTAINED_HOVER_BACKGROUND_COLOR = "#3F51B5";
export const PRIMARY_OUTLINED_HOVER__BACKGROUND_COLOR =
  "rgba(63, 81, 181, 0.08)";
export const PRIMARY_RESTING_BACKGROUND_COLOR = "rgba(63, 81, 181, 0.5)";

// Secondary Colors
export const SECONDARY_COLOR = "#0071B1";
export const SECONDARY_COLOR_LIGHTEN = "#338DC0";
export const SECONDARY_COLOR_DARKEN = "#004F7B";
export const SECONDARY_COLOR_CONSTRAST = "#FFFFFF";
export const SECONDARY_CONTAINED_HOVER_BACKGROUND_COLOR = "#F50057";
export const SECONDARY_OUTLINED_HOVER__BACKGROUND_COLOR =
  "rgba(245, 0, 87, 0.08)";
export const SECONDARY_RESTING_BACKGROUND_COLOR = "rgba(245, 0, 87, 0.5)";

// Text Colors
export const PRIMARY_TEXT_COLOR = "rgba(0, 0, 0, 0.87)";
export const SECONDARY_TEXT_COLOR = "rgba(0, 0, 0, 0.6)";
export const DISABLED_TEXT_COLOR = "rgba(0, 0, 0, 0.38)";

// Action Colors
export const ACTION_BACKGROUND_COLOR_ACTIVE = "rgba(0, 0, 0, 0.54)";
export const ACTION_BACKGROUND_COLOR_HOVER = "rgba(0, 0, 0, 0.04)";
export const ACTION_BACKGROUND_COLOR_SELECTED = "rgba(0, 0, 0, 0.08)";
export const ACTION_BACKGROUND_COLOR_DISABLED = "rgba(0, 0, 0, 0.26)";
export const ACTION_BACKGROUND_COLOR_DISABLED_BACKGROUND =
  "rgba(0, 0, 0, 0.12)";
export const ACTION_BACKGROUND_COLOR_FOCUS = "rgba(0, 0, 0, 0.12)";

// Other colors
export const DIVIDER_COLOR = "#F5F5F5";

export const TRANSITION_DURATION_SHORTEST = 150;
export const TRANSITION_DURATION_SHORTER = 200;
export const TRANSITION_DURATION_SHORT = 250;
export const TRANSITION_DURATION_STANDARD = 300;
export const TRANSITION_DURATION_COMPLEX = 375;
export const TRANSITION_DURATION_ENTERINGSCREEN = 225;
export const TRANSITION_DURATION_LEAVINGSCREEN = 195;

export const ZINDEX_MOBILESTEPPER = 1000;
export const ZINDEX_FAB = 1050;
export const ZINDEX_SPEEDDIAL = 1050;
export const ZINDEX_APPBAR = 1100;
export const ZINDEX_DRAWER = 1200;
export const ZINDEX_MODAL = 1300;
export const ZINDEX_SNACKBAR = 1400;
export const ZINDEX_TOOLTIP = 1500;

export const TRANSITION_EASING_EASEINOUT = "cubic-bezier(0.4, 0, 0.2, 1)";
export const TRANSITION_EASING_EASEOUT = "cubic-bezier(0.0, 0, 0.2, 1)";
export const TRANSITION_EASING_EASEIN = "cubic-bezier(0.4, 0, 1, 1)";
export const TRANSITION_EASING_SHARP = "cubic-bezier(0.4, 0, 0.6, 1)";

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

export const WRAPPER_PRODUCT_ITEM_SPACING = 8;

export const USER_ORDER_DAY_FORMAT = "DD/MM/YYYY";
export const USER_ORDER_DAY_FORMAT_MOBILE = "DD/MM YYYY";
export const GET_SAMPLE_FORM_COLOR = "#F2EFEB";

export const CONTACT_INFORMATION = {
  phoneNumber: "02873056686",
  email: "consumer.services@vn.nestle.com",
  address:
    "Số 7, đường 17A, Khu Công nghiệp Biên Hòa 2, P.An Bình, Biên Hòa, Đồng Nai, Việt Nam",
};

export const KOL_KOC_TRACKING_KEY = "op_source";
