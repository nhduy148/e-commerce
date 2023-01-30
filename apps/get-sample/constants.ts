import { ITypographyFontSize } from "@gsp/types";

export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_HTML_FONTSIZE = 16;
export const COEF: number = DEFAULT_FONT_SIZE / 14;

export function pxToRem(size: number) {
  return `${(size / DEFAULT_HTML_FONTSIZE) * COEF}rem`;
}

export const DEFAULT_FONT_NAME = "Roboto";
export const FONT_FAMILIES: string[] = [DEFAULT_FONT_NAME, "sans-serif"];

export const DESKTOP_FONTSIZE: ITypographyFontSize = {
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

// Primary Colors
export const PRIMARY_COLOR = "#0096D1";
export const PRIMARY_COLOR_LIGHTEN = "#5ec7ff";
export const PRIMARY_COLOR_DARKEN = "#0068a0";
export const PRIMARY_COLOR_CONSTRAST = "#FFFFFF";

// Secondary Colors
export const SECONDARY_COLOR = "#84bd00";
export const SECONDARY_COLOR_LIGHTEN = "#b8f04a";
export const SECONDARY_COLOR_DARKEN = "#518c00";
export const SECONDARY_COLOR_CONSTRAST = "#FFFFFF";

// Text Colors
export const PRIMARY_TEXT_COLOR = "#2D2F31";
export const SECONDARY_TEXT_COLOR = "#919191";
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

export const WRAPPER_PRODUCT_ITEM_SPACING = 8;

export const USER_ORDER_DAY_FORMAT = "DD/MM/YYYY";
export const USER_ORDER_DAY_FORMAT_MOBILE = "DD/MM YYYY";
export const GET_SAMPLE_FORM_COLOR = "#F2EFEB";
