import { IPageDataItem, useGetBlogListPost } from "@hera/data";
import { BlogCard } from "@lc/BlogComponent";
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import Slider from "react-slick";

interface Props {
  isPC: boolean;
  data: IPageDataItem;
}

const StyledSlider = styled(Slider)`
  .slick-dots {
    bottom: 0;
  }
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
const LcBlogReviewProductComponent = ({ isPC, data }: Props) => {
  const { formatMessage } = useIntl();
  const { data: listPost } = useGetBlogListPost({
    categoryId: data.id,
    size: 6,
  });

  const settingsReviewProduct = {
    dots: isPC ? false : true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: (
      <Box
        sx={{
          transform: "translateX(50%)",
          display: `${isPC ? "block" : "none !important"}`,
          zIndex: 1,
          width: "auto",
          height: "auto",
          right: 0,
          top: "35%",
          "::before, ::after": { content: "none" },
        }}
      >
        <IconButton aria-label="delete">
          <ArrowForwardIosIcon />
        </IconButton>
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
          top: "35%",
          "::before, ::after": { content: "none" },
        }}
      >
        <IconButton aria-label="delete">
          <ArrowBackIosIcon />
        </IconButton>
      </Box>
    ),
  };
  return (
    <Box mt={isPC ? 5 : 2}>
      <Box>
        <Typography variant="h4" fontStyle="italic" mb={1}>
          {data.name}
        </Typography>
        {listPost?.data?.length === 0 ? (
          <Box>{formatMessage({ id: "blogPage.noPost" })}</Box>
        ) : (
          <StyledSlider {...settingsReviewProduct}>
            {listPost?.data?.map((post, index) => (
              <Box key={index} sx={{ px: { md: 2, xs: 1 } }} pb={1}>
                <BlogCard
                  tipName={data.name}
                  postData={post}
                  hiddenContent={true}
                />
              </Box>
            ))}
          </StyledSlider>
        )}
      </Box>
    </Box>
  );
};

export const LcBlogReviewProduct = memo(LcBlogReviewProductComponent, isEqual);
