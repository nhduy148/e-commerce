import { IMainBanner } from "@hera/data";
import { IImageProps } from "@hera/types";
import { Banner } from "@hera/ui";
import { useBreakPoint } from "@lc/hooks";
import { FallbackImage600x300 } from "@lc/static/images";
import { Box, Link, styled } from "@mui/material";
import { FC } from "react";

type IBannerProps = {
  title1?: string;
  title2?: string;
  onClick?: () => void;
  withBordered?: boolean;
  withContent?: boolean;
  banner: IMainBanner;
  isLoading?: boolean;
  desktopRatio?: {
    x: number;
    y: number;
  };
  mobileRatio?: {
    x: number;
    y: number;
  };
  ImageProps?: Omit<IImageProps, "src">;
};

const ImageContent = styled(Box)`
  color: ${({ theme }) => theme.palette.grey[50]};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  color: ${({ theme }) => theme.palette.common.white};
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const ImageLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: ${({ theme }) => theme.palette.grey["900"]};
  position: relative;
  display: flex;

  &:hover {
    ::after {
      width: 60%;
    }
  }

  ::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 0%;
    height: 2px;
    background-color: ${({ theme }) => theme.palette.grey["900"]};
    transition: ${({ theme }) => theme.transitions.duration.short}ms
      ${({ theme }) => theme.transitions.easing.easeInOut};
  }
`;

const LcBanner: FC<IBannerProps> = ({
  title1,
  title2,
  banner,
  desktopRatio,
  mobileRatio,
  withBordered,
  withContent,
  isLoading,
  ImageProps,
}) => {
  const isPC = useBreakPoint("sm");

  return (
    <Box
      width={1}
      maxWidth={withBordered ? 1362 : 1340}
      mx="auto"
      p={withBordered ? 1.25 : 0}
      border={withBordered ? "1px solid" : "none"}
      borderColor="primary.main"
    >
      <Box position="relative" width={1}>
        <Banner
          source={banner}
          ratio={isPC ? desktopRatio : mobileRatio}
          fallback={FallbackImage600x300.src}
        />
      </Box>
    </Box>
  );
};

LcBanner.defaultProps = {
  withBordered: true,
  withContent: true,
  isLoading: false,
  mobileRatio: {
    x: 343,
    y: 100,
  },
  desktopRatio: {
    x: 1120,
    y: 250,
  },
  ImageProps: {},
};

export { LcBanner };
