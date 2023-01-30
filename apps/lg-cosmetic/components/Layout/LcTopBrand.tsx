import { ITopBrands } from "@hera/data";
import { Image } from "@hera/ui";
import { LcIconButton } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { FallbackImage600x300 } from "@lc/static/images";
import { Box, Container, styled } from "@mui/material";
import { BREAK_POINTS } from "apps/lg-cosmetic/constants";
import { useRouter } from "next/router";
import { FC, memo, useMemo } from "react";
import isEqual from "react-fast-compare";
import Slider, { Settings as SlickSliderSettings } from "react-slick";
interface ITopBrandProps {
  data?: ITopBrands[];
}
const Wrapper = styled("div")`
  background-color: ${({ theme }) => theme.palette.grey[900]};
  color: ${({ theme }) => theme.palette.grey[50]};
`;

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
      <LcIconButton size="small" active iconName="arrow_forward_ios" />
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
      <LcIconButton size="small" active iconName="arrow_back_ios_new" />
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

const LcTopBrandComponent: FC<ITopBrandProps> = ({ data }) => {
  const isPC = useBreakPoint("sm");
  const { push } = useRouter();
  const slidesToShow = useMemo(() => {
    if (data.length >= 4) {
      return 4;
    }
    return data.length;
  }, [data.length]);

  return (
    <Wrapper>
      <Container sx={{ py: 4 }} maxWidth="lg">
        <StyledSlider
          {...{ slidesToShow: slidesToShow, arrows: isPC, ...sliderSetting }}
        >
          {data?.map(({ desktopPhotoUrl, mobilePhotoUrl, name, url }, key) => {
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
                  <Image
                    src={isPC ? desktopPhotoUrl : mobilePhotoUrl}
                    alt={name}
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    fallbackImage={FallbackImage600x300}
                  />
                </Box>
              </Box>
            );
          })}
        </StyledSlider>
      </Container>
    </Wrapper>
  );
};

LcTopBrandComponent.defaultProps = {
  data: [],
};

export const LcTopBrand = memo(LcTopBrandComponent, isEqual);
