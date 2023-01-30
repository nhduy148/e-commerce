import { IBannerObject, IMainBanner } from "@hera/data";
import { useBreakPoint } from "@hera/hooks";
import { getBannerUrl, ratioToPercentage } from "@hera/utils";
import { Link, styled, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { isEmpty, isNil, isString } from "lodash-es";
import { useRouter } from "next/router";
import { CSSProperties, FC, memo, useMemo, useState } from "react";

interface IProps {
  source: IMainBanner;
  alt?: string;
  fallback?: string;
  ratio?: {
    x: number;
    y: number;
  };
  imageOptions?: {
    objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
    objectPosition?: "bottom" | "center" | "left" | "right" | "top";
  };
}

const styles: { [key: string]: CSSProperties } = {
  absoluteFill: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
  blur: { filter: "blur(5px)" },
};

const StyledImage = styled("img")`
  width: 100%;
  height: 100%;
`;

const StyledPicture = styled("picture")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
`;

const StyledBlurImage = styled("img")`
  object-fit: contain;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  filter: blur(5px);
`;

export const Banner: FC<IProps> = memo(
  ({ source, alt, fallback, ratio, imageOptions }) => {
    const router = useRouter();
    const isPC = useBreakPoint("sm");
    const [isImageLoaded, setImageLoaded] = useState(false);
    const {
      breakpoints: { values: breakpoints },
    } = useTheme();
    const imageSource = useMemo(
      () => getBannerUrl(source, isPC),
      [source, isPC],
    );

    const renderImage = useMemo(() => {
      if (!isNil(fallback) && !isEmpty(fallback)) {
        return (
          <StyledImage
            src={fallback}
            alt={alt}
            style={{ ...styles.absoluteFill, ...imageOptions }}
            onLoad={() => setImageLoaded(true)}
          />
        );
      }

      if (isString(imageSource)) {
        return (
          <StyledPicture style={{ ...imageOptions }}>
            <StyledImage
              src={imageSource}
              onLoad={() => setImageLoaded(true)}
              alt={alt}
              style={{ ...imageOptions }}
              loading="lazy"
            />
          </StyledPicture>
        );
      }

      return (
        <>
          {!isImageLoaded && (
            <StyledBlurImage
              src={(imageSource as IBannerObject)?.placeholder}
            />
          )}
          <StyledPicture>
            <source
              srcSet={(imageSource as IBannerObject)?.small}
              media={`(max-width: ${breakpoints.xs}px)`}
            />
            <source
              srcSet={(imageSource as IBannerObject)?.large}
              media={`(max-width: ${breakpoints.sm}px)`}
            />
            <StyledImage
              src={fallback || (imageSource as IBannerObject)?.large}
              onLoad={() => setImageLoaded(true)}
              alt={alt}
              style={{ ...imageOptions }}
              loading="lazy"
            />
          </StyledPicture>
        </>
      );
    }, [isImageLoaded, imageSource, fallback]);

    if (isNil(imageSource) || isEmpty(imageSource)) {
      return null;
    }

    return (
      <Link
        href={source?.url || "#"}
        onClick={(e) => {
          e.preventDefault();
          if (source?.url) {
            router.push(source.url);
          }
        }}
        sx={{
          transition: `all 300ms`,
          width: "100%",
          ":hover": {
            opacity: 0.88,
          },
        }}
      >
        <Box
          position="relative"
          width={1}
          pt={ratioToPercentage(ratio?.x || 1152, ratio?.y || 200)}
        >
          <Box sx={{ ...styles.absoluteFill, overflow: "hidden" }}>
            {renderImage}
          </Box>
        </Box>
      </Link>
    );
  },
);

Banner.defaultProps = {
  imageOptions: {
    objectFit: "cover",
    objectPosition: "center",
  },
};
