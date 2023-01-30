import { IBannerData, IMainBanner, ISliderItem } from "@hera/data";
import { Banner } from "@hera/ui";
import { ratioToPercentage } from "@hera/utils";
import { LcIconButton } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import {
  Box,
  Container,
  Divider,
  lighten,
  Skeleton,
  Stack,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { FC, memo, useMemo, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import {
  default as Slider,
  Settings as SlickSliderSettings,
} from "react-slick";

interface IHomeSliderProps {
  sliders: ISliderItem[];
  listBrands: IBannerData[];
  sliderSetting?: SlickSliderSettings;
  isLoading?: boolean;
}

const StyledContainer = styled(Box)`
  border: 1px solid ${({ theme }) => lighten(theme.palette.primary.main, 0.5)};
  margin: 0 auto;
`;

// Override slick style
const StyledSlider = styled(Slider)`
  // Disable text padding for next/image
  letter-spacing: 0;
  word-spacing: 0;
  font-size: 0;

  position: relative;

  .slick-dotted.slick-slider {
    margin-bottom: 30px;
  }

  .slick-dots {
    position: absolute;
    bottom: 16px;
    left: 34px;
    width: auto;
    display: inline-block !important;
    ${({ theme }) => theme.breakpoints.up("sm")} {
      display: none !important;
    }
  }

  .slick-dots li {
    color: ${({ theme }) => lighten(theme.palette.primary.main, 0.5)};

    ${({ theme }) => theme.breakpoints.down("sm")} {
      margin: 0;
    }
  }

  .slick-dots li button:hover:before,
  .slick-dots li button:focus:before {
    opacity: 1;
  }

  .slick-dots li button:before {
    ${({ theme }) => theme.breakpoints.down("sm")} {
      font-size: 6px;
      width: 14px;
      height: 14px;
      line-height: 14px;
    }

    font-size: 8px;

    color: ${({ theme }) => theme.palette.common.white};
    opacity: 1;
  }

  .slick-dots li.slick-active button:before {
    color: ${({ theme }) => theme.palette.primary.main};
    border: ${({ theme }) => theme.palette.primary.main} 1px solid;
    outline: none;
    border-radius: 50%;
  }
`;

const StyledLcIconButton = styled(LcIconButton)`
  background-color: rgba(252, 228, 236, 0.5);
  color: ${({ theme }) => theme.palette.primary.dark};
  width: 44px;
  height: 44px;
  :hover {
    background-color: rgba(252, 228, 236, 0.8);
  }
`;

const LcHomeSliderComponent: FC<IHomeSliderProps> = ({
  sliders,
  isLoading,
  listBrands,
  sliderSetting,
}) => {
  const { formatMessage } = useIntl();
  const { palette } = useTheme();
  const { push } = useRouter();
  const isPC = useBreakPoint("sm");
  const sliderRef = useRef<Slider>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const sliderSettings: SlickSliderSettings = useMemo(
    () => ({
      ...sliderSetting,
      beforeChange(_, nextSlide) {
        setActiveSlideIndex(nextSlide);
      },
    }),
    [],
  );

  const handleBrandItemClick = (url: string) => push(url);

  const renderLoading = (
    <Box sx={{ width: 1, height: 478, position: "relative" }}>
      <Skeleton
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: isLoading ? 1 : -1,
        }}
        animation="wave"
        variant="rectangular"
      />
    </Box>
  );

  const renderSlider =
    sliders?.length > 1 ? (
      <StyledSlider {...sliderSettings} ref={sliderRef}>
        {sliders.map((slider, key) => (
          <Banner
            key={key}
            source={slider}
            ratio={isPC ? { x: 943, y: 515 } : { x: 375, y: 205 }}
          />
        ))}
      </StyledSlider>
    ) : sliders?.length === 1 ? (
      <Banner
        source={sliders[0]}
        ratio={isPC ? { x: 943, y: 515 } : { x: 375, y: 205 }}
      />
    ) : null;

  const renderListBrand =
    listBrands?.length > 0 && isPC ? (
      <Box
        flex="1 1 225px"
        minWidth={225}
        maxWidth={225}
        bgcolor="common.white"
        position="relative"
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            overflowY: "auto",
            "::-webkit-scrollbar-track": {
              "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.1)",
              backgroundColor: "#f9f9f9",
            },

            "::-webkit-scrollbar": {
              width: 3,
              backgroundColor: "#f9f9f9",
            },

            "::-webkit-scrollbar-thumb": {
              backgroundColor: palette.primary.main,
              borderRadius: 1,
            },
          }}
        >
          <Stack
            divider={
              <Divider
                flexItem
                sx={{
                  background: "transparent",
                  boxShadow: "inset 0px -1px 0px #EDEDED",
                }}
              />
            }
            sx={{ px: 1.75 }}
          >
            {listBrands?.map((brand, index) => (
              <Box
                position="relative"
                pt={ratioToPercentage(197, 120)}
                key={index}
                onClick={() => handleBrandItemClick(brand?.url || "#")}
                sx={{
                  cursor: "pointer",
                  transition: "all 300ms",
                  width: "100%",
                  ":hover": {
                    opacity: 0.6,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 40,
                    right: 40,
                    bottom: 40,
                    left: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Banner
                    source={brand as unknown as IMainBanner}
                    ratio={{ x: 197, y: 120 }}
                    imageOptions={{ objectFit: "contain" }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    ) : null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: sliders?.[activeSlideIndex]?.color || "transparent",
        transition: "background-color 1000ms",
      }}
    >
      {sliders?.length > 0 && isPC && (
        <Box
          width={60}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <StyledLcIconButton
            iconName="chevron_left"
            onClick={sliderRef?.current?.slickPrev}
          />
        </Box>
      )}
      <Container sx={{ mx: 0, px: { xs: 0, sm: 2 } }}>
        {isLoading ? (
          renderLoading
        ) : (
          <Box display="flex">
            {renderListBrand}
            <Box flex="1 1 100%" width={100}>
              {renderSlider}
            </Box>
          </Box>
        )}
      </Container>
      {sliders?.length > 0 && isPC && (
        <Box
          width={60}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <StyledLcIconButton
            iconName="chevron_right"
            onClick={sliderRef?.current?.slickNext}
          />
        </Box>
      )}
    </Box>
  );
};

LcHomeSliderComponent.defaultProps = {
  isLoading: false,
  sliders: [],
  sliderSetting: {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
  },
};

export const LcHomeSlider = memo(LcHomeSliderComponent, isEqual);
