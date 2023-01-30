import { IMainBanner } from "@hera/data";
import { Banner } from "@hera/ui";
import { FC } from "react";

interface IProps {
  banner: IMainBanner;
  ratio?: {
    x: number;
    y: number;
  };
  isLoading?: boolean;
  imageOptions?: {
    objectFit?: JSX.IntrinsicElements["img"]["style"]["objectFit"];
    objectPosition?: JSX.IntrinsicElements["img"]["style"]["objectPosition"];
  };
}

export const GSPSingleBanner: FC<IProps> = ({
  banner,
  ratio,
  isLoading,
  imageOptions,
}) => {
  return (
    <Banner
      source={banner}
      ratio={ratio}
      // @ts-ignore
      imageOptions={imageOptions}
    />
  );
};
