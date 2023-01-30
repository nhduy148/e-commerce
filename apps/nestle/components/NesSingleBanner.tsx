import { IMainBanner } from "@hera/data";
import { Banner } from "@hera/ui";
import { FC } from "react";

interface IProps {
  banner: IMainBanner;
  ratio?: {
    x: number;
    y: number;
  };
}

export const NesSingleBanner: FC<IProps> = ({ banner, ratio }) => {
  return (
    <Banner
      source={banner}
      ratio={ratio}
      imageOptions={{ objectFit: "cover" }}
    />
  );
};
