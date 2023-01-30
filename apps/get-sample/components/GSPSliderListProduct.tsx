import {
  GSPLoadingProduct,
  GSPProductItem,
  GSPSectionHeading,
} from "@gsp/components";
import { BREAK_POINTS } from "@gsp/constants";
import { useBreakPoint } from "@gsp/hooks";
import { IProduct } from "@hera/data";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Icon,
  IconButton,
  lighten,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, useMemo, useRef } from "react";
import isEqual from "react-fast-compare";
import Slider, { Settings as SlickSliderSettings } from "react-slick";

interface IFlashSaleProps {
  heading: string;
  showHeading?: boolean;
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

const GSPSliderListProductComponent = ({
  showEmptyText,
  showHeading,
  heading,
  products,
  sliderSetting,
  isLoading,
  emptyText,
  enableShowMoreButton,
  showMoreButtonText,
}: IFlashSaleProps) => {
  if (isLoading) {
    return <GSPLoadingProduct total={4} />;
  }

  const isPC = useBreakPoint("sm");
  const { palette, breakpoints } = useTheme();

  const restSettings: SlickSliderSettings = useMemo(() => {
    let slidesToShow = 4;
    if (products?.length > 4 && isPC) {
      slidesToShow = 4;
    } else if (products?.length > 2 && !isPC) {
      slidesToShow = 2;
    } else {
      slidesToShow = products?.length;
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
  }, [isPC, products]);

  const sliderRef = useRef<Slider>();

  const arrowStyle = {
    width: 28,
    height: 28,
    background: lighten(palette.primary.main, 0.9),
    borderRadius: 0.5,
    color: palette.action.active,
    ":before": {
      content: "none",
    },
    ":focus": {
      background: lighten(palette.primary.main, 0.9),
      color: palette.action.active,
    },
    ":hover": {
      background: palette.primary.light,
      color: palette.primary.contrastText,
    },
  };

  const renderEmpty = showEmptyText ? (
    <Typography variant="subtitle1">{emptyText}</Typography>
  ) : null;

  return (
    <Box>
      <Box mb={3} position="relative" minHeight={24}>
        {showHeading && heading?.length > 0 && (
          <Box mb={5}>
            <GSPSectionHeading text={heading} />
          </Box>
        )}
        <Stack
          spacing={0.5}
          direction="row"
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
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
      {products?.length > 0 ? (
        <>
          <StyledSlider
            {...{ ...sliderSetting, ...restSettings }}
            initialSlide={4}
            ref={sliderRef}
          >
            {products?.map((product, index) => (
              <Box sx={{ px: 1 }} pb={1} key={index}>
                <GSPProductItem product={product} />
              </Box>
            ))}
          </StyledSlider>
          {enableShowMoreButton && (
            <Box mt={3} textAlign="center">
              <Button
                variant="text"
                endIcon={<Icon fontSize="inherit">arrow_forward</Icon>}
              >
                {showMoreButtonText}
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

GSPSliderListProductComponent.defaultProps = {
  heading: "",
  isLoading: false,
  products: [],
  sliderSetting,
  showMoreButtonText: "Xem thêm",
  enableShowMoreButton: false,
  emptyText: "Chưa có sản phẩm nào",
};

export const GSPSliderListProduct = memo(
  GSPSliderListProductComponent,
  isEqual,
);
