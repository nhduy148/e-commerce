import { ISlider } from "@hera/data";
import { Banner } from "@hera/ui";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Link, Skeleton, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BREAK_POINTS } from "@nestle/constants";
import { useBreakPoint } from "@nestle/hooks";
import { useRouter } from "next/router";
import { FC, memo, useMemo, useState } from "react";
import isEqual from "react-fast-compare";
import Slider, { Settings as SlickSliderSettings } from "react-slick";

interface IHomeSliderProps {
  sliders: ISlider;
  sliderSetting?: SlickSliderSettings;
  isLoading?: boolean;
}

// Override slick style
const SliderContainer = styled(Box)`
  // Disable text padding for next/image
  letter-spacing: 0;
  word-spacing: 0;
  font-size: 0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const StyledSlider = styled(Slider)`
  position: relative;
`;

const NesHomeSliderComponent: FC<IHomeSliderProps> = ({
  sliders,
  isLoading,
  sliderSetting,
}) => {
  const isPC = useBreakPoint("sm");
  const { palette } = useTheme();
  const { push } = useRouter();
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
      background: palette.custom.homeBannerArrowBackground,
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
    };
  }, [sliderSetting, isPC]);

  return (
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
          />
        </Box>
      ) : (
        <StyledSlider {...settings}>
          {sliders.sliderItems.map((slider, key) => (
            <Box key={key} position="relative">
              <Link
                href={slider?.link || "#"}
                onClick={(e) => {
                  e.preventDefault();
                  if (slider?.link) {
                    push(slider.link);
                  }
                }}
              >
                <Banner
                  source={slider}
                  ratio={{ x: 21, y: 9 }}
                  imageOptions={{ objectFit: "cover" }}
                />
              </Link>
            </Box>
          ))}
        </StyledSlider>
      )}
    </SliderContainer>
  );
};

NesHomeSliderComponent.defaultProps = {
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

export const NesHomeSlider = memo(NesHomeSliderComponent, isEqual);
