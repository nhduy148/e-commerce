import { StaticImageSource } from "@gsp/static/images";
import { Breakpoint } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

export type IThemeMode = "light" | "dark";

export type ITypographyFontSize = {
  [key in Variant]: number;
};

export type IBreakPoints = {
  [key in Breakpoint]: number;
};

export type IItemPerBreakPoint = {
  [key in Breakpoint]?: 4 | 3 | 2;
};

export type ILanguage = "vi" | "en";

export type IResponseLanguage = {
  [key in ILanguage]: string;
};

export interface IFilterParams {
  brandIds: number[];
  taxonIds: number[];
  prices: number[];
}

// For static get sample homepage
export type GuideStep = {
  image: StaticImageSource;
  text: string;
};

export type GuideCategory = {
  image: StaticImageSource;
  name: string;
};
