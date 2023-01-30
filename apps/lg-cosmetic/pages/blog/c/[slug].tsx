import {
  IPaginationQuery,
  useGetBlogListPost,
  useGetBlogPageData,
} from "@hera/data";
import { BlogCard, BlogSubCard } from "@lc/BlogComponent";
import { LcSubscribeSection } from "@lc/components";
import {
  Box,
  Breadcrumbs,
  Grid,
  Link,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LcProductListLayout from "apps/lg-cosmetic/components/LcProductListLayout";
import { useRouter } from "next/router";
import { useState } from "react";
import { useIntl } from "react-intl";

const BlogListItem = ({ slugData }) => {
  const { locale, formatMessage } = useIntl();
  const theme = useTheme();
  const isPC = useMediaQuery(theme.breakpoints.up("sm"));
  const router = useRouter();
  const [postPaginationParams, setPostPaginationParams] = useState({
    categoryId: slugData[0].id,
    size: 10,
    page: 1,
  });
  const { data: listPost } = useGetBlogListPost(postPaginationParams);
  const { data: listTopTrendingPost } = useGetBlogListPost({
    size: 6,
    tag: "top trending",
  });

  const [queries, setQuery] = useState<IPaginationQuery>({ size: 10, page: 1 });
  const page = listPost?.paginate?.page || 1;
  const total = listPost?.paginate?.total || 1;
  const size = listPost?.paginate?.size || 1;
  const totalPages = Math.ceil(total / size);
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          href="/blog"
          variant="overline"
          textTransform="uppercase"
          onClick={(e) => {
            e.preventDefault();
            router.push("/blog");
          }}
        >
          Blog
        </Link>
        <Link underline="none" textTransform="uppercase">
          {slugData[0].name}
        </Link>
      </Breadcrumbs>
      <Box mt={6}>
        <Box>
          <Typography variant="h3" fontStyle="italic">
            {slugData[0].name}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={8} xs={12}>
            <Box>
              {listPost?.data.length === 0 ? (
                <Box></Box>
              ) : (
                listPost?.data.map((post, index) => {
                  if (!isPC) {
                    return (
                      <Box
                        mt={2}
                        borderBottom="1px solid"
                        sx={{ borderColor: "grey.400" }}
                      >
                        <BlogCard
                          key={index}
                          tipName={"Top trending"}
                          onBorder={false}
                          postData={post}
                          hiddenContent={true}
                          bgColor={"transparent"}
                        />
                      </Box>
                    );
                  }
                  return (
                    <Box py={2} borderBottom="1px solid" borderColor="grey.500">
                      <BlogSubCard
                        tipName={post.category.name}
                        postData={post}
                        onBorder={isPC ? true : false}
                        hiddenContent={true}
                        layoutLeft={{ sm: 5, xs: 5 }}
                        layoutRight={{ sm: 7, xs: 7 }}
                        imageMaxHeight={isPC ? "200px" : "100px"}
                        height={isPC ? "200px" : "100px"}
                        fontType={"body1"}
                      />
                    </Box>
                  );
                })
              )}
              {totalPages > 1 && (
                <Pagination
                  sx={{
                    mt: "16px",
                    "& .MuiPagination-ul": {
                      justifyContent: "center",
                    },
                  }}
                  onChange={(e, page) => {
                    if (page === listPost?.paginate?.page) {
                      return;
                    }
                    setQuery((current) => ({ ...current, page: page }));
                    const newPostPrams = {
                      ...postPaginationParams,
                      page: page,
                    };
                    setPostPaginationParams(newPostPrams);
                  }}
                  shape="rounded"
                  count={totalPages}
                  page={page}
                  boundaryCount={2}
                />
              )}
            </Box>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <Typography variant="h5" textTransform="uppercase" width="100%">
                  Top Trending
                </Typography>
                <Box
                  height="1px"
                  width="100%"
                  borderTop="1px solid"
                  sx={{ borderColor: "grey.500" }}
                ></Box>
              </Box>
              <Box mt={1}>
                {listTopTrendingPost?.data?.length === 0 ? (
                  <Box>{formatMessage({ id: "blogPage.noPost" })}</Box>
                ) : (
                  listTopTrendingPost?.data?.map((topPost, index) => {
                    return (
                      <Box
                        mt={2}
                        borderBottom="1px solid"
                        sx={{ borderColor: "grey.400" }}
                      >
                        <BlogCard
                          key={index}
                          tipName={"Top trending"}
                          onBorder={false}
                          postData={topPost}
                          hiddenContent={true}
                          bgColor={"transparent"}
                        />
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const BlogList = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const { data: pageData } = useGetBlogPageData();
  const slugData = pageData?.data?.filter((data) => data.slug === slug);

  return (
    <LcProductListLayout setBanner={false}>
      <>
        {slugData && <BlogListItem slugData={slugData} />}
        <Box mt={8}>
          <LcSubscribeSection />
        </Box>
      </>
    </LcProductListLayout>
  );
};

export default BlogList;
