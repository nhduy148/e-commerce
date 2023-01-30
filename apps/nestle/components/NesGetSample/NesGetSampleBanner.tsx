import { ratioToPercentage } from "@hera/utils";
import { Box, Link, Skeleton, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ServerImage } from "@nestle/components";
import { useBreakPoint } from "@nestle/hooks";
import { FallbackImage600x300 } from "@nestle/static/images";
import { useRouter } from "next/router";
import { FC, memo, useState } from "react";
import isEqual from "react-fast-compare";

interface IGetSampleProps {
  banner: string;
  bannerLink: string;
  isLoading?: boolean;
}

// Override slick style
const BannerContainer = styled(Box)`
  font-size: 0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const NesGetSampleBannerComponent: FC<IGetSampleProps> = ({
  banner,
  bannerLink,
  isLoading,
}) => {
  const isPC = useBreakPoint("sm");
  const { palette } = useTheme();
  const { push } = useRouter();
  const [isSliderLoading, setIsSliderLoading] = useState(true);
  return (
    <BannerContainer onLoad={() => setIsSliderLoading(false)}>
      {isLoading ? (
        <Box sx={{ width: 1, height: "480px", position: "relative" }}>
          <Skeleton
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: isSliderLoading ? 1 : -1,
              width: "100%",
              height: "100%",
            }}
            animation="wave"
            variant="rectangular"
          ></Skeleton>
        </Box>
      ) : (
        <Box>
          <Box position="relative">
            <Link
              href={bannerLink || "#"}
              onClick={(e) => {
                e.preventDefault();
                if (bannerLink) {
                  push(bannerLink);
                }
              }}
            >
              <Box
                position="relative"
                pt={ratioToPercentage(isPC ? 21 : 20, isPC ? 9 : 10)}
              >
                <ServerImage
                  src={banner}
                  alt={"Get sample banner"}
                  fallbackImage={FallbackImage600x300}
                  layout="fill"
                />
              </Box>
            </Link>
          </Box>
        </Box>
      )}
    </BannerContainer>
  );
};

NesGetSampleBannerComponent.defaultProps = {
  isLoading: false,
};

export const NesGetSampleBanner = memo(NesGetSampleBannerComponent, isEqual);
