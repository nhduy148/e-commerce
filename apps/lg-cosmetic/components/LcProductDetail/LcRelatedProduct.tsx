import { useGetRelatedProduct } from "@hera/data";
import {
  Box,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import Slider from "react-slick";
import { LcIconButton } from "../LcIconButton";
import { LcProductItem } from "../LcProductItem";

interface Props {
  productId: number;
}

const StyledSlider = styled(Slider)`
  .slick-dots li {
    margin: 0;
  }

  .slick-dots li button:before {
    font-size: 8px;
  }

  .slick-dots li button:hover:before,
  .slick-dots li button:focus:before {
    opacity: 1;
  }

  .slick-dots li.slick-active button:before {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  width: 100%;

  .slick-slide {
    height: 100%;
  }

  .slick-list {
    margin: 0 -8px;
  }
`;

const LcRelatedProductComponent = ({ productId }: Props) => {
  const theme = useTheme();
  const isPC = useMediaQuery(theme.breakpoints.up("sm"));
  const { data: relatedProducts } = useGetRelatedProduct(productId);

  const { formatMessage } = useIntl();

  const pageContent = {
    similarProducts: formatMessage({ id: "productDetail.similarProducts" }),
    noProducts: formatMessage({ id: "productDetail.noProducts" }),
  };

  let slidesToShow: number;

  if (isPC) {
    slidesToShow =
      relatedProducts?.data.length < 4 ? relatedProducts?.data.length : 4;
  } else {
    slidesToShow = relatedProducts?.data.length === 1 ? 1 : 2;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: (
      <Box
        sx={{
          transform: "translateX(50%)",
          display: `${isPC ? "block" : "none !important"}`,
          zIndex: 1,
          width: "auto",
          height: "auto",
          right: 0,
          "::before, ::after": { content: "none" },
        }}
      >
        <LcIconButton active iconName="arrow_forward_ios" />
      </Box>
    ),
    prevArrow: (
      <Box
        sx={{
          transform: "translateX(-50%)",
          display: `${isPC ? "block" : "none !important"}`,
          zIndex: 1,
          width: "auto",
          height: "auto",
          left: 0,
          "::before, ::after": { content: "none" },
        }}
      >
        <LcIconButton active iconName="arrow_back_ios_new" />
      </Box>
    ),
  };

  return (
    <Box mt={4} mb={5}>
      <Typography color="primary" variant="h5" textTransform="uppercase">
        {pageContent.similarProducts}
      </Typography>
      <Box
        mt={4.25}
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {isPC && relatedProducts?.data.length < 4 ? (
          <Box>
            <Grid container spacing={2}>
              {relatedProducts?.data?.map((data) => (
                <Box maxWidth="276px" minWidth="276px" pl={2}>
                  <Grid item>
                    <LcProductItem product={data} />
                  </Grid>
                </Box>
              ))}
            </Grid>
          </Box>
        ) : (
          <>
            {relatedProducts?.data?.length > 0 ? (
              <StyledSlider {...settings}>
                {relatedProducts?.data?.map((product, index) => {
                  return (
                    <Box key={index} sx={{ px: { md: 2, xs: 1 } }} pb={1}>
                      <LcProductItem product={product} />
                    </Box>
                  );
                })}
              </StyledSlider>
            ) : (
              <Typography variant="subtitle1">
                {pageContent.noProducts}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export const LcRelatedProduct = memo(LcRelatedProductComponent, isEqual);
