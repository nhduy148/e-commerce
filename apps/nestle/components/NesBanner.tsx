import { Image } from "@hera/ui";
import { Box, lighten, Link, styled, Typography } from "@mui/material";
import React from "react";

type IBannerProps = {
  title1: string;
  title2: string;
  imageUrl: string;
  onClick?: () => void;
};

const ImageContainer = styled(Box)`
  border: 1px solid ${({ theme }) => lighten(theme.palette.primary.main, 0.5)};
  max-width: 1340px;
  position: relative;
`;

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

export const NesBanner: React.FunctionComponent<IBannerProps> = ({
  title1,
  title2,
  imageUrl,
}) => {
  return (
    <ImageContainer sx={{ p: { sm: 1.25, xs: 1 } }}>
      <ImageContent sx={{ pl: { sm: "10%", xs: "5%" } }}>
        <Typography
          component="span"
          sx={{ typography: { sm: "h3", xs: "h5" } }}
          textTransform="uppercase"
        >
          {title1}
        </Typography>
        <Typography
          component="span"
          sx={{ typography: { sm: "h3", xs: "h5" } }}
          textTransform="uppercase"
        >
          {title2}
        </Typography>
        <ImageLink
          href="#"
          underline="none"
          sx={{ typography: { sm: "subtitle1", xs: "overline" } }}
        >
          XEM BỘ SƯU TẬP
        </ImageLink>
      </ImageContent>
      <Image src={imageUrl} alt="about us" width={1320} height={460} />
    </ImageContainer>
  );
};
