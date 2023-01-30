import { IProductImage } from "@hera/data";
import { Box, BoxProps, styled, useTheme } from "@mui/material";
import { isEmpty } from "lodash-es";
import { CSSProperties, FC, useState } from "react";

interface IProps extends BoxProps {
  source: IProductImage;
  alt: string;
  fallback: string;
  type?: "absoluteFill" | "fixed";
}
const styles: { [key: string]: CSSProperties } = {
  absoluteFill: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
  blur: { filter: "blur(5px)" },
};

const StyledImage = styled("img")`
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: 100%;
`;

const StyledPicture = styled("picture")`
  object-fit: contain;
  object-position: center;
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

const ProductImage: FC<IProps> = ({
  source,
  alt,
  type,
  fallback,
  ...props
}) => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isImageLoadFailed, setImageLoadFailed] = useState(false);
  const {
    breakpoints: { values: breakpoints },
  } = useTheme();

  if (isEmpty(source)) {
    return <StyledImage src={fallback} alt={alt} style={styles.absoluteFill} />;
  }

  return (
    <Box
      {...(type === "absoluteFill" && { sx: styles.absoluteFill })}
      {...props}
    >
      {!isImageLoaded && (
        <StyledBlurImage src={source?.placeholder || source?.thumb} />
      )}
      <StyledPicture>
        <source
          srcSet={source?.large}
          media={`(min-width: ${breakpoints.md}px)`}
        />
        <source
          srcSet={source?.thumb}
          media={`(min-width: ${breakpoints.sm}px)`}
        />
        <source srcSet={source?.small} media={`(min-width: 0px)`} />
        <StyledImage
          src={source?.original || fallback}
          alt={alt}
          loading="lazy"
          onLoad={() => {
            setImageLoaded(true);
            setImageLoadFailed(false);
          }}
          onError={() => {
            setImageLoaded(true);
            setImageLoadFailed(true);
          }}
        />
      </StyledPicture>
    </Box>
  );
};

ProductImage.defaultProps = {
  type: "absoluteFill",
};

export { ProductImage };
