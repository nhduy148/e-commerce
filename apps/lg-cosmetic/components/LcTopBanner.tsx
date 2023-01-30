import { ICommonPageData, IMainBanner } from "@hera/data";
import { IImageProps } from "@hera/types";
import { Box, Container } from "@mui/material";
import { forwardRef, memo } from "react";
import isEqual from "react-fast-compare";
import { LcBanner } from "./LcBanner";

interface ITopBannerProps extends IImageProps {
  data: ICommonPageData;
}

const LcTopBannerComponent = forwardRef<HTMLDivElement, ITopBannerProps>(
  ({ data }, ref) => {
    const banner = {
      topBannerDesktopImage: data?.topBannerDesktopImage,
      topBannerMobileImage: data?.topBannerMobileImage,
    };

    let bgColor = "primary.light";
    if (data?.topBannerBackgroundColor) {
      bgColor = data?.topBannerBackgroundColor;
    }

    return (
      <Box sx={{ backgroundColor: bgColor }} ref={ref}>
        <Container sx={{ px: { xs: 0, sm: 2 } }}>
          <LcBanner
            banner={banner as unknown as IMainBanner}
            desktopRatio={{ x: 1440, y: 100 }}
            mobileRatio={{ x: 375, y: 50 }}
            withBordered={false}
            withContent={false}
          />
        </Container>
      </Box>
    );
  },
);

export const LcTopBanner = memo(LcTopBannerComponent, isEqual);
