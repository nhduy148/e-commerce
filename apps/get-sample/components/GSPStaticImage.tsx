import { default as StaticImage, StaticImageSource } from "@gsp/static/images";
import Image, { ImageProps } from "next/image";
import { FC } from "react";

interface IProps extends Omit<ImageProps, "src"> {
  src: StaticImageSource | string;
}

export const GSPStaticImage: FC<IProps> = ({ src, ...props }) => {
  if (StaticImage?.[src]?.src) {
    return (
      <Image
        {...props}
        src={StaticImage?.[src].src}
        width={props?.width || StaticImage?.[src]?.width}
        height={props?.height || StaticImage?.[src]?.height}
      />
    );
  }
  return null;
};
