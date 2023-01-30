import { IImageProps } from "@hera/types";
import { validImageUrl } from "@hera/utils";
import { Box, Skeleton } from "@mui/material";
import NextImage, { StaticImageData } from "next/image";
import { memo, useEffect, useState } from "react";
import isEqual from "react-fast-compare";

// const fallbackImage = (width: number, height: number) => {
//   if (width / height > 1) {
//     return FallbackImage600x300;
//   }
//   if (width / height < 1) {
//     return FallbackImage300x600;
//   }
//   return FallbackImage400x400;
// };

const ImageComponent: React.FunctionComponent<IImageProps> = ({
  src,
  isLoading,
  fallbackImage,
  ...props
}) => {
  // @ts-ignore
  const [imageUrl, setImageUrl] = useState<string | StaticImageData>(src);
  const [isImageLoading, setImageLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const loading = isImageLoading || isLoading;

  useEffect(() => {
    // @ts-ignore
    setImageUrl(src || fallbackImage);
  }, [src, fallbackImage]);

  const getImageSource = () => {
    if (!imageUrl) {
      if (typeof fallbackImage === "string" && validImageUrl(fallbackImage)) {
        return fallbackImage;
      } else if (fallbackImage && typeof fallbackImage === "object") {
        return fallbackImage?.src;
      } else {
        setError(true);
        return;
      }
    }
    if (typeof imageUrl === "string" && validImageUrl(imageUrl)) {
      return imageUrl;
    } else if (imageUrl && typeof imageUrl === "object") {
      return imageUrl?.src;
    } else {
      if (typeof fallbackImage === "string" && validImageUrl(fallbackImage)) {
        return fallbackImage;
      } else if (typeof fallbackImage === "object") {
        return fallbackImage?.src;
      } else {
        setError(true);
        return;
      }
    }
  };

  if (isError) {
    if (props?.layout === "fill") {
      return (
        <Box
          bgcolor="grey.200"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: 1,
            height: 1,
          }}
        />
      );
    }
    return (
      <Box
        bgcolor="grey.200"
        width={props?.width || "100%"}
        height={props?.height || "100%"}
      />
    );
  }

  const renderImage = (
    <Box sx={{ letterSpacing: 0, wordSpacing: 0, fontSize: 0 }}>
      <NextImage
        //@ts-ignore
        src={getImageSource()}
        onError={(e) => {
          setImageLoading(false);
          if (
            typeof fallbackImage === "string" &&
            validImageUrl(fallbackImage)
          ) {
            setImageUrl(fallbackImage);
          } else if (fallbackImage && typeof fallbackImage === "object") {
            setImageUrl(fallbackImage?.src);
          } else {
            setError(true);
          }
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
            if (
              typeof fallbackImage === "string" &&
              validImageUrl(fallbackImage)
            ) {
              setImageUrl(fallbackImage);
            } else if (fallbackImage && typeof fallbackImage === "object") {
              setImageUrl(fallbackImage?.src);
            } else {
              setError(true);
            }
          }
          setImageLoading(false);
          if (typeof props.onLoadingComplete === "function") {
            props.onLoadingComplete(e);
          }
        }}
        {...props}
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

export const Image = memo(ImageComponent, isEqual);
