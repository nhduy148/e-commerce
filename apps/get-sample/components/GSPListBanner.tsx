import { GSPSectionHeading } from "@gsp/components";
import { useBreakPoint } from "@gsp/hooks";
import StaticImage from "@gsp/static/images";
import { IMainBanner } from "@hera/data";
import { Banner } from "@hera/ui";
import { validImageUrl } from "@hera/utils";
import {
  Box,
  BoxProps,
  Grid,
  Skeleton,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { FC } from "react";

interface IGSPListBannerProps extends BoxProps {
  banners: IMainBanner[];
  showHeading?: boolean;
  headingImage?: string;
  heading?: string;
  isLoading?: boolean;
  sx?: SxProps;
}

const GSPListBannerComponent: FC<IGSPListBannerProps> = ({
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
  const itemHeight = banners.length < 3 ? 240 : banners.length < 6 ? 180 : 120;

  const renderHeading = () => {
    if (showHeading && heading.length > 0) {
      if (validImageUrl(headingImage)) {
        return (
          <Box mb={5} textAlign="center">
            <picture>
              <source
                media={`(min-width: ${breakpoints.values.xs})`}
                srcSet={headingImage}
              />
              <img
                src={StaticImage.FallbackImage600x300?.src}
                alt={heading || ""}
              />
            </picture>
          </Box>
        );
      } else {
        return (
          <Box mb={5}>
            <GSPSectionHeading text={heading} />
          </Box>
        );
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
              <Banner source={banner} ratio={{ x: itemWidth, y: itemHeight }} />
              <Typography variant="h6" sx={{ mt: 2 }} textAlign="center">
                {banner?.imageLabel}
              </Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

GSPListBannerComponent.defaultProps = {
  isLoading: false,
};

export { GSPListBannerComponent as GSPListBanner };
