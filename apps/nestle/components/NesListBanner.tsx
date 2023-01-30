import { IMainBanner } from "@hera/data";
import { validImageUrl } from "@hera/utils";
import {
  Box,
  BoxProps,
  Grid,
  Skeleton,
  SxProps,
  useTheme,
} from "@mui/material";
import { NesSectionHeading, NesSingleBanner } from "@nestle/components";
import { useBreakPoint } from "@nestle/hooks";
import { FC } from "react";

interface INesListBannerProps extends BoxProps {
  banners: IMainBanner[];
  showHeading?: boolean;
  headingImage?: string;
  heading?: string;
  isLoading?: boolean;
  sx?: SxProps;
}

const NesListBannerComponent: FC<INesListBannerProps> = ({
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
            <img src={headingImage} alt={heading || ""} />
          </Box>
        );
      } else {
        return <NesSectionHeading text={heading} />;
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
              <NesSingleBanner
                banner={banner}
                ratio={{ x: itemWidth, y: 240 }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

NesListBannerComponent.defaultProps = {
  isLoading: false,
};

export { NesListBannerComponent as NesListBanner };
