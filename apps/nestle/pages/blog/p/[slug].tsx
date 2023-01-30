import { AuthenticationContext } from "@hera/contexts";
import {
  useDeleteReactPost,
  useGetBlogListPost,
  useReactPost,
  useShowPost,
} from "@hera/data";
import { formatDetailDayTime } from "@hera/utils";
import { InsertComment as InsertCommentIcon } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Chip,
  Grid,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NesSubscribeSection } from "@nestle/components";
import {
  BlogCard,
  NesBlogComment,
  NesBlogFavorite,
} from "apps/nestle/components/NesBlog";
import NesProductListLayout from "apps/nestle/components/NesProductListLayout";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

const BlogDetail = () => {
  const { locale, formatMessage } = useIntl();
  const theme = useTheme();
  const isPC = useMediaQuery(theme.breakpoints.up("sm"));
  const router = useRouter();
  const authen = useContext(AuthenticationContext);
  const slug = router.query.slug as string;
  const {
    data: postItem,
    refetch: postRefetch,
    isFetching,
  } = useShowPost(slug);
  const { data: listTopTrendingPost } = useGetBlogListPost({
    size: 6,
    tag: "top trending",
  });
  const { mutate: favoriteClick } = useReactPost();
  const { mutate: DeleteFavoriteClick } = useDeleteReactPost();
  const [snackBarProps, setSnackBarProps] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    postRefetch();
  }, [authen?.isLogin]);

  useEffect(() => {
    setIsFavorite(postItem?.data?.alreadyReaction);
    setFavoriteCount(postItem?.data?.heartCount);
  }, [postItem]);

  const handleClose = () => {
    setSnackBarProps({ ...snackBarProps, open: false });
  };
  const handleClickFavorite = () => {
    setIsLoading(true);
    if (!authen?.isLogin) {
      setSnackBarProps({ open: true, vertical: "top", horizontal: "center" });
      return;
    }
    favoriteClick(
      { id: postItem?.data.id },
      {
        onSuccess() {
          setIsFavorite(true);
          setIsLoading(false);
          setFavoriteCount((prev) => prev + 1);
        },
      },
    );
  };

  const handleDeleteClickFavorite = () => {
    setIsLoading(true);
    DeleteFavoriteClick(
      { id: postItem?.data.id },
      {
        onSuccess() {
          setIsFavorite(false);
          setIsLoading(false);
          setFavoriteCount((prev) => prev - 1);
        },
      },
    );
  };

  useEffect(() => {
    if (postItem?.data?.id) {
      router.push("/404");
    }
  }, []);

  if (isFetching) {
    return "Loading ...";
  }
  return (
    <NesProductListLayout>
      <>
        <Box>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ "& ol .MuiBreadcrumbs-separator ": { mx: "4px" } }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/blog"
              textTransform="uppercase"
              variant="overline"
              onClick={(e) => {
                e.preventDefault();
                router.push("/blog");
              }}
            >
              Blog
            </Link>
            <Link
              underline="hover"
              textTransform="uppercase"
              variant="overline"
              href={`/blog/c/${postItem?.data?.category?.slug}`}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/blog/c/${postItem.data.category?.slug}`);
              }}
            >
              {postItem?.data?.category?.name}
            </Link>
          </Breadcrumbs>
          <Box mt={6}>
            <Grid container spacing={2}>
              <Grid item sm={8} xs={12}>
                <Box>
                  <Box>
                    <Typography variant="h5">
                      {postItem?.data?.title}
                    </Typography>
                  </Box>
                  <Box
                    mt={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Link
                      href={`/blog/c/${postItem?.data?.category?.slug}`}
                      underline="none"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(
                          `/blog/c/${postItem?.data?.category?.slug}`,
                        );
                      }}
                    >
                      <Box
                        display="inline-flex"
                        alignItems="center"
                        sx={{
                          backgroundColor: "common.black",
                          px: "8px",
                          py: "2px",
                        }}
                      >
                        <Typography
                          variant={isPC ? "body1" : "caption"}
                          color="common.white"
                        >
                          {postItem?.data.category?.name}
                        </Typography>
                      </Box>
                    </Link>
                    <Typography variant="caption" color="grey.500">
                      LGCosmetics &nbsp; | &nbsp;
                      {formatDetailDayTime(postItem?.data?.updatedAt, locale)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ "& img": { width: "100%" } }}
                    dangerouslySetInnerHTML={{
                      __html: postItem?.data?.content,
                    }}
                  />
                </Box>
                <Box display="flex">
                  <Typography textTransform="uppercase" mr={2} flex={1}>
                    {formatMessage({ id: "blogDetailPage.tags" })}
                  </Typography>
                  <Box flex={isPC ? 7 : 4}>
                    {postItem?.data?.tags?.length === 0 ? (
                      <Box></Box>
                    ) : (
                      postItem?.data?.tags?.map((tagName, index) => {
                        return (
                          <Chip
                            label={tagName}
                            size="small"
                            color="primary"
                            sx={{ ml: "8px", mb: "8px" }}
                          />
                        );
                      })
                    )}
                  </Box>
                </Box>
                <Box mt={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "grey.900",
                    }}
                  >
                    <NesBlogFavorite
                      isfavorite={isFavorite}
                      favoriteCount={favoriteCount}
                      onClickFavorites={handleClickFavorite}
                      onClickDeleteFavorite={handleDeleteClickFavorite}
                      isLogin={authen?.isLogin}
                      disableFavorite={isLoading}
                    />
                    <Box display="flex" alignItems="center" ml={2}>
                      <IconButton
                        color="primary"
                        aria-label="favorite"
                        disabled
                      >
                        <InsertCommentIcon />
                      </IconButton>
                      <Typography variant="body1">
                        {`${commentCount}
                    ${formatMessage({ id: "blogDetailPage.comments" })}`}
                      </Typography>
                    </Box>
                  </Box>
                  {postItem?.data && (
                    <NesBlogComment
                      postId={postItem?.data?.id}
                      setCommentCount={setCommentCount}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item sm={4} xs={12}>
                {!isPC ? (
                  <Box></Box>
                ) : (
                  <Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Typography
                        variant="h5"
                        textTransform="uppercase"
                        width="100%"
                      >
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
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box mt={8}>
          <NesSubscribeSection />
        </Box>
      </>
    </NesProductListLayout>
  );
};

export default BlogDetail;
