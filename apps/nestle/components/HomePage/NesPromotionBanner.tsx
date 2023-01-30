import { IBannerData } from "@hera/data";
import { Image } from "@hera/ui";
import { Box, Container, Link, styled, Tooltip } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";

const StyledWrapper = styled(Box)`
  position: relative;
`;

interface IProps {
  banner: IBannerData;
  isLoading?: boolean;
}

const NesHomePromotionBannerComponent: FC<IProps> = ({ isLoading, banner }) => {
  const isPC = useBreakPoint("sm");
  return (
    <Container maxWidth="lg">
      <StyledWrapper
        sx={{
          letterSpacing: 0,
          wordSpacing: 0,
          fontSize: 0,
        }}
      >
        <Tooltip title={banner?.title || ""}>
          <Link href={banner?.url || ""}>
            <Image
              src={isPC ? banner?.desktopPhotoUrl : banner?.mobilePhotoUrl}
              alt={banner?.title || ""}
              width={1240}
              isLoading={isLoading}
              height={303}
              key={isPC ? banner?.desktopPhotoUrl : banner?.mobilePhotoUrl}
            />
          </Link>
        </Tooltip>
      </StyledWrapper>
    </Container>
  );
};

export const NesHomePromotionBanner = memo(
  NesHomePromotionBannerComponent,
  isEqual,
);
