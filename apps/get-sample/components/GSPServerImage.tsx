import { default as StaticImage } from "@gsp/static/images";
import { IImageProps } from "@hera/types";
import { validImageUrl } from "@hera/utils";
import { Box, Skeleton } from "@mui/material";
import NextImage, { StaticImageData } from "next/image";
import { FC, memo, useCallback, useState } from "react";
import isEqual from "react-fast-compare";

const ImageComponent: FC<IImageProps> = ({
  src,
  isLoading,
  fallbackImage,
  ...props
}) => {
  // @ts-ignore
  const [imageUrl, setImageUrl] = useState<string | StaticImageData>(src);
  const [isImageLoading, setImageLoading] = useState<boolean>(true);
  const loading = isLoading || isImageLoading;

  const renderFallbackImage = useCallback(() => {
    if (fallbackImage) {
      return fallbackImage;
    }
    let width = Number(props?.width?.toString()?.split("px")?.[0]) || 0;
    let height = Number(props?.height?.toString()?.split("px")?.[0]) || 0;
    if (width / height > 1) {
      return StaticImage.FallbackImage600x300;
    }
    if (width / height < 1) {
      return StaticImage.FallbackImage300x600;
    }
    return StaticImage.FallbackImage400x400;
  }, [props?.width, props?.height, src]);

  const getImageSource = () => {
    if (!imageUrl) {
      return renderFallbackImage();
    }
    if (typeof imageUrl === "string" && validImageUrl(imageUrl)) {
      return imageUrl;
    } else {
      return renderFallbackImage();
    }
  };

  const [imageDimension, setImageDimension] = useState({
    naturalWidth: 500,
    naturalHeight: 500,
  });

  const renderImage = (
    <Box sx={{ fontSize: 0, lineHeight: 0 }}>
      <NextImage
        //@ts-ignore
        src={getImageSource()}
        onError={(e) => {
          setImageLoading(false);
          setImageUrl(renderFallbackImage());
          if (typeof props.onError === "function") {
            props.onError(e);
          }
        }}
        onLoad={(e) => {
          setImageLoading(true);
          if (typeof props.onLoad === "function") {
            props.onLoad(e);
          }
        }}
        onLoadingComplete={(e) => {
          if (e.naturalWidth === 0) {
            setImageUrl(renderFallbackImage());
          } else {
            setImageDimension(e);
          }
          setImageLoading(false);
          if (typeof props.onLoadingComplete === "function") {
            props.onLoadingComplete(e);
          }
        }}
        {...props}
        width={props?.width || imageDimension?.naturalWidth}
        height={props?.height || imageDimension?.naturalHeight}
      />
    </Box>
  );

  const renderSkeleton = loading && (
    <Skeleton
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: loading ? 1 : -1,
      }}
      variant="rectangular"
      width="100%"
      height="100%"
    />
  );

  if (props?.layout === "fill") {
    return (
      <>
        {renderSkeleton}
        {renderImage}
      </>
    );
  }

  return (
    <Box position="relative">
      {renderSkeleton}
      {renderImage}
    </Box>
  );
};

export const GSPServerImage = memo(ImageComponent, isEqual);
