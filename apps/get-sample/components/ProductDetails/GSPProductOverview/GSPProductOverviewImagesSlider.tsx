import { GSPServerImage } from "@gsp/components";
import { useBreakPoint } from "@gsp/hooks";
import { IProductDetail } from "@hera/data";
import { Box, Grid, styled } from "@mui/material";
import { FC, useRef, useState } from "react";
import Slider from "react-slick";
interface IProps {
  product: IProductDetail;
  isLoading: boolean;
}

export const GSPProductOverviewImagesSlider: FC<IProps> = ({
  product,
  isLoading,
}) => {
  const sliderRef = useRef<Slider>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const isPC = useBreakPoint("sm");

  return (
    <Grid container>
      <Grid
        item
        sm={2}
        xs={12}
        sx={{
          overflowY: "auto",
          height: { sm: "464px", xs: "auto" },
          display: { sm: "block", xs: "flex" },
          justifyContent: "flex-start",
        }}
        order={{ sm: 1, xs: 2 }}
      >
        {product?.images.map((image, i) => {
          return (
            <Box
              key={i}
              mt={{ sm: 0, xs: 2 }}
              mr={{ sm: 0, xs: 2 }}
              mb={2}
              sx={{
                border: `2px solid ${
                  i === activeSlideIndex ? "grey.400" : "transparent"
                }`,
                cursor: i === activeSlideIndex ? "default" : "pointer",
                pointerEvents: i === activeSlideIndex ? "none" : "all",
                opacity: i === activeSlideIndex ? 0.7 : 1,
              }}
              onClick={() => sliderRef.current.slickGoTo(i)}
            >
              <GSPServerImage
                isLoading={isLoading}
                src={image.small}
                height={isPC ? 64 : 74}
                width={isPC ? 64 : 74}
                alt={product.name}
              />
            </Box>
          );
        })}
      </Grid>
      <Grid
        order={{ sm: 2, xs: 1 }}
        item
        sm={10}
        xs={12}
        sx={{
          height: "auto",
          pr: { sm: "16px", xs: 0 },
          ml: { sm: "-16px", xs: 0 },
        }}
        display="flex"
      >
        <StyledSlider
          ref={sliderRef}
          afterChange={(index) => setActiveSlideIndex(index)}
          {...settings}
        >
          {product?.images.map((image, i) => {
            return (
              <GSPServerImage
                key={i}
                isLoading={isLoading}
                src={image.large}
                width={470}
                height={470}
                alt={product.name}
              />
            );
          })}
        </StyledSlider>
      </Grid>
    </Grid>
  );
};

const settings = {
  arrows: false,
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const StyledSlider = styled(Slider)`
  width: 100%;
`;
