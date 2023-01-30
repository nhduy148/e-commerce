import { useGetBlogListPost } from "@hera/data";
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { BlogCard } from "apps/nestle/components/NesBlog";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import Slider from "react-slick";

interface Props {
  isPC: boolean;
}

const StyledSlider = styled(Slider)`
  .slick-dots {
    top: 40%;
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
const NesBlogTopTrendingComponent = ({ isPC }: Props) => {
  const { formatMessage } = useIntl();
  const { data: listPost } = useGetBlogListPost({
    size: 6,
    tag: "top trending",
  });
  const settings = {
    dots: isPC ? false : true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
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
    <Box>
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          <Box
            sx={{
              backgroundColor: { xs: "transparent", sm: "error.50" },
              borderRadius: "4px",
              p: { xs: 0, sm: 3 },
            }}
          >
            <Typography variant="h4" fontStyle="italic" mb={1}>
              Top Trending
            </Typography>
            {listPost?.data?.length === 0 ? (
              <Box>{formatMessage({ id: "blogPage.noPost" })}</Box>
            ) : (
              <StyledSlider {...settings}>
                {listPost?.data.map((post, index) => (
                  <Box sx={{ px: { md: 2, xs: 1 } }} pb={1}>
                    <BlogCard
                      tipName={"Top trending"}
                      postData={post}
                      bgColor={isPC ? "error.50" : "transparent"}
                      onBorder={true}
                      hiddenContent={false}
                    />
                  </Box>
                ))}
              </StyledSlider>
            )}
          </Box>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Box display={isPC ? "block" : "flex"} sx={{ mx: "-8px" }}>
            {listPost?.data?.length === 0 || !listPost?.data[0] ? (
              <Box>{formatMessage({ id: "blogPage.noPost" })}</Box>
            ) : (
              <>
                <Box flex={1} px={1}>
                  <BlogCard
                    tipName={"Top trending"}
                    onBorder={false}
                    postData={listPost?.data[0]}
                    hiddenContent={true}
                    bgColor={"transparent"}
                  />
                </Box>
                <Box flex={1} px={1}>
                  <BlogCard
                    tipName={"Top trending"}
                    onBorder={false}
                    postData={listPost?.data[1]}
                    hiddenContent={true}
                    bgColor={"transparent"}
                  />
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export const NesBlogTopTrending = memo(NesBlogTopTrendingComponent, isEqual);
