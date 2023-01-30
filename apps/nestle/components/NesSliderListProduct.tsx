import { IProduct } from "@hera/data";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import {
  NesLoadingProduct,
  NesProductItem,
  NesSectionHeading,
} from "@nestle/components";
import { BREAK_POINTS } from "@nestle/constants";
import { useBreakPoint } from "@nestle/hooks";
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
  showEmptyText?: boolean;
}

const StyledSlider = styled(Slider)`
  padding: 0;
  .slick-slide {
    height: 100%;
    ${({ theme }) => theme.breakpoints.up("sm")} {
      width: 288px;
    }
  }
`;

const NesSliderListProductComponent = (props: IFlashSaleProps) => {
  if (props?.isLoading) {
    return <NesLoadingProduct total={4} />;
  }

  const isPC = useBreakPoint("sm");
  const { palette, breakpoints } = useTheme();

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
      variableWidth: isPC,
      slidesToShow,
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

  const sliderRef = useRef<Slider>();

  const arrowStyle = {
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

  const itemWidth = isPC
    ? (breakpoints.values.lg - 8 * 3) / 4
    : (window?.innerWidth - 8 * 2 - 8 * 2 - 6) / 2;

  const renderEmpty = props?.showEmptyText ? (
    <Typography variant="subtitle1">{props.emptyText}</Typography>
  ) : null;

  return (
    <Box>
      <Box mb={3} position="relative" minHeight={24}>
        {props.heading?.length > 0 && (
          <NesSectionHeading text={props.heading} />
        )}
        <Stack
          spacing={0.75}
          direction="row"
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
          }}
        >
          <IconButton
            sx={{ ...arrowStyle }}
            onClick={() => sliderRef?.current?.slickPrev()}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            sx={{ ...arrowStyle }}
            onClick={() => sliderRef?.current?.slickNext()}
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      </Box>
      {props.products?.length > 0 ? (
        <>
          <StyledSlider
            {...{ ...props.sliderSetting, ...restSettings }}
            initialSlide={4}
            ref={sliderRef}
          >
            {props.products?.map((product, index) => (
              <Box sx={{ px: 1 }} pb={1} key={index}>
                <NesProductItem product={product} />
              </Box>
            ))}
          </StyledSlider>
          {props.enableShowMoreButton && (
            <Box mt={3} textAlign="center">
              <Button
                variant="text"
                endIcon={<Icon fontSize="inherit">arrow_forward</Icon>}
              >
                {props.showMoreButtonText}
              </Button>
            </Box>
          )}
        </>
      ) : (
        renderEmpty
      )}
    </Box>
  );
};

const sliderSetting: SlickSliderSettings = {
  arrows: false,
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToScroll: 1,
  slidesPerRow: 1,
  centerMode: false,
  rows: 1,
  adaptiveHeight: true,
  lazyLoad: "progressive",
};

NesSliderListProductComponent.defaultProps = {
  heading: "",
  isLoading: false,
  products: [],
  sliderSetting,
  showMoreButtonText: "Xem thêm",
  enableShowMoreButton: false,
  emptyText: "Chưa có sản phẩm nào",
};

export const NesSliderListProduct = memo(
  NesSliderListProductComponent,
  isEqual,
);
