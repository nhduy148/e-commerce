import { BREAK_POINTS } from "@gsp/constants";
import { useBreakPoint } from "@gsp/hooks";
import { getBannerImageSource } from "@gsp/utils";
import { ISlider } from "@hera/data";
import { Banner } from "@hera/ui";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Container, IconButton, Skeleton, useTheme } from "@mui/material";
import { lighten, styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useMemo, useState } from "react";
import isEqual from "react-fast-compare";
import Slider, { Settings as SlickSliderSettings } from "react-slick";

interface IHomeSliderProps {
  sliders: ISlider;
  sliderSetting?: SlickSliderSettings;
  isLoading?: boolean;
}

// Override slick style
const SliderContainer = styled(Box)`
  overflow: hidden;
  position: relative;
`;

const StyledSlider = styled(Slider)`
  position: relative;
`;

const GSPHomeSliderComponent: FC<IHomeSliderProps> = ({
  sliders,
  isLoading,
  sliderSetting,
}) => {
  const isPC = useBreakPoint("sm");
  const { palette } = useTheme();
  const { push } = useRouter();
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isSliderLoading, setIsSliderLoading] = useState(true);
  if (!sliders?.isActive || (sliders?.sliderItems?.length <= 0 && !isLoading)) {
    return null;
  }
  const settings = useMemo(() => {
    const arrowStyle = {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 99,
      display: "flex !important",
      width: 24,
      height: 24,
      background: lighten(palette.primary.main, 0.9),
      color: palette.action.active,
      ":before": {
        content: "none",
      },
      ":hover, :focus": {
        background: palette.primary.light,
        color: palette.primary.contrastText,
      },
    };
    return {
      ...sliderSetting,
      arrows: isPC,
      prevArrow: (
        <IconButton
          sx={{
            left: 20,
            ...arrowStyle,
          }}
        >
          <ChevronLeft />
        </IconButton>
      ),
      nextArrow: (
        <IconButton
          sx={{
            right: 20,
            ...arrowStyle,
          }}
        >
          <ChevronRight />
        </IconButton>
      ),
      beforeChange(_, nextSlide) {
        setActiveSlideIndex(nextSlide);
      },
    };
  }, []);

  const imageSource = useCallback(
    (banner) => getBannerImageSource(banner, isPC),
    [isPC],
  );
  return (
    <Box
      sx={{
        backgroundColor:
          sliders?.sliderItems?.[activeSlideIndex]?.color || "transparent",
        transition: "background-color 1000ms",
      }}
    >
      <Container sx={{ px: { xs: 0, sm: 2, md: 4 } }}>
        <SliderContainer onLoad={() => setIsSliderLoading(false)}>
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
            <StyledSlider {...settings}>
              {sliders.sliderItems.map((slider, key) => (
                <Banner
                  key={key}
                  source={slider}
                  ratio={isPC ? { x: 943, y: 515 } : { x: 375, y: 205 }}
                />
              ))}
            </StyledSlider>
          )}
        </SliderContainer>
      </Container>
    </Box>
  );
};

GSPHomeSliderComponent.defaultProps = {
  isLoading: false,
  sliders: {
    id: 0,
    isActive: false,
    sliderItems: [],
  },
  sliderSetting: {
    arrows: true,
    dots: false,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
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
  },
};

export const GSPHomeSlider = memo(GSPHomeSliderComponent, isEqual);
