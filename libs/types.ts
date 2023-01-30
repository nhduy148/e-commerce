import { JwtPayload } from "jwt-decode";
import { ImageProps, StaticImageData } from "next/image";

export type IOrganization = "lgc" | "nes" | "gsp";
export interface IImageProps extends ImageProps {
  isLoading?: boolean;
  fallbackImage?: string | StaticImageData;
}

export type ILanguage = "vi" | "en";

export type IResponseLanguage = {
  [key in ILanguage]: string;
};

export interface JWTToken extends JwtPayload {
  email?: string;
}
