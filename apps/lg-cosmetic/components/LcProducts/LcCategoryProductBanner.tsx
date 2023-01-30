import { Image } from "@hera/ui";
import { useBreakPoint } from "@lc/hooks";
import { Box, styled } from "@mui/material";
import { FunctionComponent, memo } from "react";
import isEqual from "react-fast-compare";

type ICategoryProductBannerProps = {
  src: string;
};

const StyledWrapper = styled(Box)`
  position: relative;
`;

const LcCategoryProductBannerComponent: FunctionComponent<
  ICategoryProductBannerProps
> = ({ src }) => {
  const isPC = useBreakPoint("sm");
  return (
    <StyledWrapper height={isPC ? "460px" : "188px"}>
      <Box>
        <Image src={src} alt="Category Product Banner" layout="fill" />
      </Box>
    </StyledWrapper>
  );
};

export const LcCategoryProductBanner = memo(
  LcCategoryProductBannerComponent,
  isEqual,
);
