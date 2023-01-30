import { IProduct } from "@hera/data";
import {
  LcIconButton,
  LcLoadingProduct,
  LcProductItem,
  LcSectionHeading,
} from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import {
  Box,
  Button,
  Container,
  Icon,
  styled,
  Typography,
} from "@mui/material";
import { BREAK_POINTS } from "apps/lg-cosmetic/constants";
import { memo, useMemo, useRef } from "react";
import isEqual from "react-fast-compare";
import Slider, { Settings as SlickSliderSettings } from "react-slick";

interface IFlashSaleProps {
  heading: string;
  products: IProduct[];
  isLoading?: boolean;
  emptyText?: string;
  sliderSetting?: SlickSliderSettings;
  enableShowMoreButton?: boolean;
  showMoreButtonText?: string;
}

const StyledSlider = styled(Slider)`
  margin: 0;
  .slick-list {
    max-width: ${({ theme }) => theme.breakpoints.values.lg}px;
  }
  .slick-slide {
    height: 100%;
    ${({ theme }) => theme.breakpoints.up("sm")} {
      max-width: 300px;
    }
  }
  .slick-dots {
    li {
      width: 8px;
      height: 8px;
      margin: 0 6px;
      button {
        border-radius: 50%;
        width: 8px;
        height: 8px;
        font-size: 0;
        background: #fce4ec;
        ::before {
          content: none;
        }
      }
    }
    .slick-active button {
      background: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

const StyledLcIconButton = styled(LcIconButton)`
  background-color: rgba(252, 228, 236, 0.5);
  color: ${({ theme }) => theme.palette.primary.main};
  width: 44px;
  height: 44px;
  :hover {
    background-color: rgba(252, 228, 236, 0.8);
  }
`;

const LcSliderListProductComponent = (props: IFlashSaleProps) => {
  const isPC = useBreakPoint("sm");
  const sliderRef = useRef<Slider>(null);
  const restSettings: SlickSliderSettings = useMemo(() => {
    let slidesToShow = 4;
    if (props.products?.length > 4 && isPC) {
      slidesToShow = 4;
    } else if (props.products?.length > 2 && !isPC) {
      slidesToShow = 2;
    } else {
      slidesToShow = props?.products?.length;
    }

    return {
      arrows: false,
      slidesToShow,
      dots: !isPC,
      responsive: [
        {
          breakpoint: BREAK_POINTS.sm,
          settings: {
            slidesToShow,
          },
        },
      ],
    };
  }, [isPC, props.products]);

  return (
    <Box>
      {props.heading && (
        <Container>
          <Box mb={{ sm: 7, xs: 3 }}>
            <LcSectionHeading text={props.heading} />
          </Box>
        </Container>
      )}
      {props?.isLoading ? (
        <Container>
          <LcLoadingProduct total={4} />
        </Container>
      ) : props.products?.length ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {props?.products?.length > restSettings.slidesToShow && isPC && (
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
          <Container
            sx={{ mx: 0, px: { xs: 1, sm: 1 }, flex: "1 1 100%", width: 100 }}
          >
            <Box
              overflow={{ xs: "hidden", sm: "visible" }}
              pb={{ xs: 4, sm: 0 }}
            >
              <StyledSlider
                {...{ ...props.sliderSetting, ...restSettings }}
                ref={sliderRef}
              >
                {props.products?.map((product, index) => (
                  <Box sx={{ px: { md: 2, xs: 1 } }} pb={1} key={index}>
                    <LcProductItem product={product} />
                  </Box>
                ))}
              </StyledSlider>
            </Box>
          </Container>
          {props?.products?.length > restSettings.slidesToShow && isPC && (
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
      ) : (
        <Container>
          <Typography variant="subtitle1">{props.emptyText}</Typography>
        </Container>
      )}
      {props.enableShowMoreButton && (
        <Container>
          <Box mt={5}>
            <Box mt={3} textAlign="center">
              <Button
                variant="text"
                endIcon={<Icon fontSize="inherit">arrow_forward</Icon>}
              >
                {props.showMoreButtonText}
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
};

const sliderSetting: SlickSliderSettings = {
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToScroll: 1,
  centerMode: false,
};

LcSliderListProductComponent.defaultProps = {
  heading: "",
  isLoading: false,
  products: [],
  sliderSetting,
  showMoreButtonText: "Xem thêm",
  enableShowMoreButton: false,
  emptyText: "Chưa có sản phẩm nào",
};

export const LcSliderListProduct = memo(LcSliderListProductComponent, isEqual);
