import { Image } from "@hera/ui";
import { Box, styled } from "@mui/material";
import { FunctionComponent, memo, useMemo, useState } from "react";
import isEqual from "react-fast-compare";

type ILcProductListBannerProps = {
  src: string;
  isPC: boolean;
};

const StyledWrapper = styled(Box)`
  position: relative;
`;

const LcProductListBannerComponent: FunctionComponent<
  ILcProductListBannerProps
> = ({ src, isPC }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const renderedImage = useMemo(
    () => (
      <Image
        src={src}
        alt="Promotion banner"
        onLoad={() => {
          setIsImageLoading(true);
        }}
        onLoadingComplete={() => {
          setIsImageLoading(false);
        }}
        layout="fill"
      />
    ),
    [isImageLoading, src],
  );

  return (
    <StyledWrapper height={isPC ? "240px" : "220px"}>
      <Box>{renderedImage}</Box>
    </StyledWrapper>
  );
};

export const LcProductListBanner = memo(LcProductListBannerComponent, isEqual);
