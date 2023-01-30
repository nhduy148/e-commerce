import { IBannerData, IMainBanner } from "@hera/data";
import { Banner } from "@hera/ui";
import { useBreakPoint } from "@lc/hooks";
import { Grid, Link, useTheme } from "@mui/material";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";
interface IProps {
  banners: IBannerData[];
  isLoading?: boolean;
  limit?: number;
}

const LcHomePromotionBannerComponent: FC<IProps> = ({
  isLoading,
  banners,
  limit,
}) => {
  const isPC = useBreakPoint("sm");
  const { breakpoints } = useTheme();
  const containerSpacing = (isPC ? 8 * 3 : 8 * 2) * 2;
  const itemSpacing = 8 * 3 * limit - 1;
  const itemWidth =
    (breakpoints.values.lg - itemSpacing - containerSpacing) / limit;

  return (
    <Grid container spacing={banners?.length > 1 ? { xs: 2, md: 4 } : 0}>
      {banners.map(
        (banner, index) =>
          index < limit && (
            <Grid
              item
              md={12 / limit}
              xs={12}
              sx={{ width: { xs: 1, sm: "auto" } }}
              key={index}
            >
              <Link href={banner?.url || "#"}>
                <Banner
                  source={banner as unknown as IMainBanner}
                  ratio={{ x: itemWidth, y: 250 }}
                />
              </Link>
            </Grid>
          ),
      )}
    </Grid>
  );
};

LcHomePromotionBannerComponent.defaultProps = {
  banners: [],
  isLoading: false,
  limit: 2,
};

export const LcHomePromotionBanner = memo(
  LcHomePromotionBannerComponent,
  isEqual,
);
