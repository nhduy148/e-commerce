import { FC } from "react";

import { IMainBanner } from "@hera/data";
import { Banner } from "@hera/ui";
import { validImageUrl } from "@hera/utils";
import { LcSectionHeading } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { FallbackImage600x300 } from "@lc/static/images";
import {
  Box,
  BoxProps,
  Grid,
  Skeleton,
  SxProps,
  useTheme,
} from "@mui/material";

interface ILcBannerBlock extends BoxProps {
  banners: IMainBanner[];
  showHeading?: boolean;
  headingImage?: string;
  heading?: string;
  isLoading?: boolean;
  sx?: SxProps;
}

export const LcBannerBlock: FC<ILcBannerBlock> = ({
  heading,
  banners,
  isLoading,
  showHeading,
  headingImage,
  sx,
}) => {
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Skeleton width={160} height={40} sx={{ mb: 3 }} />
        <Skeleton width="100%" height={200} />
      </Box>
    );
  }

  if (!banners || banners?.length <= 0) {
    return null;
  }

  const isPC = useBreakPoint("sm");
  const { breakpoints } = useTheme();
  const containerSpacing = (isPC ? 8 * 3 : 8 * 2) * 2;
  const itemSpacing = 8 * 3 * banners.length - 1;
  const itemWidth =
    (breakpoints.values.lg - itemSpacing - containerSpacing) / banners.length;

  const renderHeading = () => {
    if (showHeading) {
      if (validImageUrl(headingImage)) {
        return (
          <Box mb={3} textAlign="center">
            <picture>
              <source
                media={`(min-width: ${breakpoints.values.xs})`}
                srcSet={headingImage}
              />
              <img src={FallbackImage600x300?.src} alt={heading || ""} />
            </picture>
          </Box>
        );
      } else {
        return <LcSectionHeading text={heading} />;
      }
    }
    return null;
  };

  return (
    <Box sx={sx}>
      {renderHeading()}
      {Array.isArray(banners) && banners.length > 0 && (
        <Grid
          container
          spacing={banners.length > 1 ? 3 : 0}
          direction={isPC ? "row" : "column"}
        >
          {banners.map((banner, index) => (
            <Grid
              item
              md={12 / banners.length}
              xs={12}
              sx={{ width: { xs: 1, sm: "auto" } }}
              key={index}
            >
              <Banner
                source={banner}
                ratio={isPC ? { x: itemWidth, y: 240 } : { x: 360, y: 196 }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

LcBannerBlock.defaultProps = {
  isLoading: false,
};
