import { IMainBanner } from "@hera/data";
import { Box, Skeleton, styled } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import { FunctionComponent, memo } from "react";
import isEqual from "react-fast-compare";
import { NesSingleBanner } from "../NesSingleBanner";

type ICategoryProductBannerProps = {
  banner: IMainBanner;
  isLoading: boolean;
};

const StyledWrapper = styled(Box)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
`;

const NesCategoryProductBannerComponent: FunctionComponent<
  ICategoryProductBannerProps
> = ({ banner, isLoading }) => {
  const isPC = useBreakPoint("sm");

  if (isLoading) {
    return (
      <StyledWrapper>
        <Box>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={isPC ? 240 : 193}
          />
        </Box>
      </StyledWrapper>
    );
  }
  return (
    <StyledWrapper>
      <Box>
        <NesSingleBanner
          banner={banner}
          ratio={{ x: 20, y: isPC ? 4.7 : 10 }}
        />
      </Box>
    </StyledWrapper>
  );
};

export const NesCategoryProductBanner = memo(
  NesCategoryProductBannerComponent,
  isEqual,
);
