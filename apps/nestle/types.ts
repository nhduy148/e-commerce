import { Breakpoint } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

export type IThemeMode = "light" | "dark";

export interface IAuthenticationModalProps {
  onClose: () => void;
  img: object;
}

export type AuthenticationModal = "login" | "register" | "forgotPassword";

export type SwitchModalObject = {
  [type in AuthenticationModal]: JSX.Element;
};

export type ITypographyFontSize = {
  [key in Variant]: number;
};

export type IBreakPoints = {
  [key in Breakpoint]: number;
};

export type IItemPerBreakPoint = {
  [key in Breakpoint]?: 6 | 5 | 4 | 3 | 2;
};

export type ILanguage = "vi" | "en";

export type IResponseLanguage = {
  [key in ILanguage]: string;
};

export interface JWTToken {
  exp?: number;
}

export interface IFilterParams {
  brandIds: number[];
  taxonIds: number[];
  prices: number[];
}

export const blogSection = {
  beautyTips: "tips-lam-dep",
  pageDataLiveStyle: "phong-cach-song",
  pageDataReviewProduct: "review-san-pham",
  pageDataTakeCare: "co-the-ban-quan-tam-Vis9",
};
