import { GSPSectionHeading, GSPServerImage } from "@gsp/components";
import { BREAK_POINTS } from "@gsp/constants";
import { useBreakPoint } from "@gsp/hooks";
import { ITopBrands } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Box, Container, IconButton, styled, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";
import Slider, { Settings as SlickSliderSettings } from "react-slick";

interface IProps {
  topBrandsData?: ITopBrands[];
}

export const GSPTopBrands: FC<IProps> = ({ topBrandsData }) => {
  const isPC = useBreakPoint("sm");
  const { push } = useRouter();
  const theme = useTheme();
  const { __ } = useFormatter();

  let slidesToShow: number;

  if (topBrandsData?.length >= 4) {
    slidesToShow = 4;
  } else {
    slidesToShow = topBrandsData?.length;
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.common.white,
        // pt: 7.5,
        pb: 12.5,
      }}
    >
      <Container maxWidth="lg">
        <GSPSectionHeading
          sx={{ mb: 7 }}
          text={__({ defaultMessage: "Thương hiệu nổi bật" })}
        />
        <StyledSlider
          {...{ slidesToShow: slidesToShow, arrows: isPC, ...sliderSetting }}
        >
          {topBrandsData?.map(
            ({ desktopPhotoUrl, mobilePhotoUrl, name, url }, key) => {
              return (
                <Box
                  px={2}
                  width={200}
                  key={key}
                  sx={{ cursor: "pointer" }}
                  onClick={() => push(url || "#")}
                >
                  <Box
                    sx={{ pb: { xs: "50%", sm: "25%" }, position: "relative" }}
                  >
                    <GSPServerImage
                      src={isPC ? desktopPhotoUrl : mobilePhotoUrl}
                      alt={name}
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                    />
                  </Box>
                </Box>
              );
            },
          )}
        </StyledSlider>
      </Container>
    </Box>
  );
};

const StyledSlider = styled(Slider)`
  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding: 0 30px;
  }
  .slick-slide {
    height: 100%;
    max-width: ${350 + 16}px;
  }
`;

const sliderSetting: SlickSliderSettings = {
  arrows: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToScroll: 1,
  nextArrow: (
    <Box
      sx={{
        width: "auto",
        height: "auto",
        right: 0,
        display: { sm: "block !important", xs: "none !important" },
        "::before, ::after": { content: "none" },
      }}
    >
      <IconButton size="small">
        <NavigateNextIcon />
      </IconButton>
    </Box>
  ),
  prevArrow: (
    <Box
      sx={{
        width: "auto",
        height: "auto",
        left: 0,
        display: { sm: "block !important", xs: "none !important" },
        "::before, ::after": { content: "none" },
      }}
    >
      <IconButton size="small">
        <NavigateBeforeIcon />
      </IconButton>
    </Box>
  ),

  responsive: [
    {
      breakpoint: BREAK_POINTS.lg,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: BREAK_POINTS.md,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: BREAK_POINTS.sm,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
