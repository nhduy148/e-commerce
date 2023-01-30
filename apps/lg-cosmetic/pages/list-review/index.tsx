import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItemButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { IReviewSort, useListHashtagReview, useListReview } from "@hera/data";
import { useBreakPoint } from "@lc/hooks";
import { LcListReviewComment } from "@lc/LcListReview";
import { LcUserPagination } from "apps/lg-cosmetic/components/UserSetting/LcUserPagination";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface IBreadcrumbs {
  name: string;
  url: string;
}

interface IContent {
  menuName: string;
  sortBy?: IReviewSort;
  filterBy?: string;
  isHashtag?: boolean;
}

const BreadcrumbsLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-transform: uppercase;
`;

const SettingMenu = styled(List)`
  background-color: ${({ theme }) => theme.palette.common.white};
  box-shadow: ${({ theme }) => theme.shadows[3]};

  .Mui-selected {
    border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
  }
`;

const SettingMenuItem = styled(ListItemButton)`
  padding: 16px;
`;

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

const breadcrumbLinks: IBreadcrumbs[] = [
  {
    name: "Trang chủ",
    url: "/",
  },
  {
    name: "Đánh giá sản phẩm",
    url: "/listReview",
  },
];
const PAGE_SIZE = 10;
const reviewContent: IContent[] = [
  {
    menuName: "review.sortByLatest",
    sortBy: "latest",
  },
  {
    menuName: "review.sortBySuggestions",
    sortBy: "recommend",
  },
  {
    menuName: "review.sortByTheMostInteractive",
    sortBy: "most_react",
  },
  {
    menuName: "review.hashtag",
    isHashtag: true,
  },
];

const ListReview = () => {
  const { formatMessage } = useIntl();
  const isPC = useBreakPoint("sm");
  const [page, setPage] = useState(1);
  const [sortBy, setSort] = useState<IReviewSort>("latest");
  const [hashtagId, setHashtagId] = useState<number | null>(null);
  const { data: listReview, isLoading } = useListReview({
    sortBy,
    hashtagId,
    size: PAGE_SIZE,
    page: page,
  });
  const { data: hashtagData, isLoading: isHashtagLoading } =
    useListHashtagReview();
  const hashtags = useMemo(() => hashtagData?.data || [], [hashtagData]);
  const renderHashtagSection = useCallback(
    (item: IContent) => {
      if (hashtags.length === 0 && !isHashtagLoading) return null;
      if (isHashtagLoading) {
        return (
          <>
            <Divider flexItem />
            <Skeleton variant="rectangular" width={120} height={10} />
            <Stack direction="row" spacing={0.5}>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  variant="rectangular"
                  width={30}
                  height={10}
                  key={index}
                />
              ))}
            </Stack>
          </>
        );
      }

      return (
        <>
          <Divider flexItem />
          <Box p={2}>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              <FormattedMessage id={item.menuName} />
            </Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
              {hashtags.map((hashtag) => (
                <Box
                  border="1px solid"
                  borderColor={
                    hashtag.id === hashtagId ? "primary.main" : "common.white"
                  }
                  px={1}
                  py={0.5}
                  margin={0.5}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      hashtag.id === hashtagId
                        ? "rgba(244, 67, 54, 0.15)"
                        : "rgba(244, 67, 54, 0.05)",
                  }}
                  key={hashtag.name + hashtag.id}
                  onClick={() => {
                    setHashtagId(hashtag.id === hashtagId ? null : hashtag.id);
                    setPage(1);
                  }}
                >
                  <Typography
                    variant="overline"
                    textTransform="initial"
                    color="primary"
                    fontWeight="bold"
                  >
                    {hashtag?.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      );
    },
    [hashtags, isHashtagLoading, hashtagId],
  );

  const renderLoading = useMemo(() => {
    return [...Array(PAGE_SIZE).keys()].map((_, index) => (
      <Box
        height={160}
        p={2}
        key={index}
        borderBottom="1px solid"
        borderColor="grey.100"
      >
        <Skeleton width="100%" height={30} />
        <Skeleton width="100%" height={80} />
        <Skeleton width={120} height={30} sx={{ ml: "auto" }} />
      </Box>
    ));
  }, []);

  return (
    <Container>
      <Box py={2.75} minHeight="50vh">
        <Box mb={4}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {breadcrumbLinks.map((link, key) => (
              <BreadcrumbsLink
                href={link.url}
                underline="hover"
                variant="overline"
                key={key}
              >
                {link.name}
              </BreadcrumbsLink>
            ))}
          </Breadcrumbs>
        </Box>
        <Typography
          textTransform="uppercase"
          sx={{
            mb: { sm: 4.75, xs: 2.5 },
            typography: { xs: "h5", sm: "h4" },
          }}
        >
          <FormattedMessage id="review.title" />
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={12} xs={12} display={isPC ? "block" : "none"}>
            <SettingMenu disablePadding>
              {reviewContent.map((item, index) => {
                if (item.isHashtag) {
                  return renderHashtagSection(item);
                }
                return (
                  <SettingMenuItem
                    key={index}
                    onClick={() => {
                      setSort(item.sortBy);
                      setPage(1);
                    }}
                    selected={sortBy === item.sortBy}
                  >
                    <FormattedMessage id={item.menuName} />
                  </SettingMenuItem>
                );
              })}
            </SettingMenu>
          </Grid>
          <Grid item lg={9} sm={12} xs={12} sx={{ mb: 20 }}>
            <SettingMenuPaper
              elevation={3}
              sx={{ p: { xs: "16px", sm: "32px" } }}
            >
              {isLoading ? (
                renderLoading
              ) : listReview?.data?.length > 0 ? (
                listReview?.data.map((item, index) => {
                  return (
                    <Box key={index}>
                      <LcListReviewComment reviewItem={item} />
                    </Box>
                  );
                })
              ) : (
                <Typography variant="subtitle2">
                  <FormattedMessage id="review.empty" />
                </Typography>
              )}
              {listReview?.paginate.total > PAGE_SIZE && (
                <Box>
                  <LcUserPagination
                    page={page}
                    onSetPage={setPage}
                    count={listReview?.paginate.totalPages}
                  />
                </Box>
              )}
            </SettingMenuPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ListReview;
