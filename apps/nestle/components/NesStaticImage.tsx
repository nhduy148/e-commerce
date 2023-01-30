import { StaticImage, StaticImageSource } from "@nestle/static/images";
import Image, { ImageProps } from "next/image";
import { FC } from "react";

interface IProps extends Omit<ImageProps, "src"> {
  src: StaticImageSource;
}

export const NesStaticImage: FC<IProps> = ({ src, ...props }) => {
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
