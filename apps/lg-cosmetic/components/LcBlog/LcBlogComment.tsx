import { AuthenticationContext } from "@hera/contexts";
import {
  useCommentPost,
  useDeleteReactComment,
  useReactComment,
  useShowPostComment,
} from "@hera/data";
import { formatDayTime } from "@hera/utils";
import { useBreakPoint } from "@lc/hooks";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  postId: number;
  setCommentCount: (e) => void;
}

const LcBlogCommentComponent = ({ postId, setCommentCount }: Props) => {
  const { formatMessage, locale } = useIntl();
  const authen = useContext(AuthenticationContext);
  const isPC = useBreakPoint("sm");
  const labelComment = formatMessage({ id: "blogDetailPage.comment" });
  const [commentValue, setCommentValue] = useState<string>("");
  const [commentPaginationParams, setCommentPaginationParams] = useState({
    postId: postId,
    size: 5,
    page: 1,
  });
  const { data: listComments, refetch: commentRefetch } = useShowPostComment(
    commentPaginationParams,
  );
  const { mutate: commentPost } = useCommentPost();
  const { mutate: reactComment } = useReactComment();
  const { mutate: deleteReactComment } = useDeleteReactComment();
  const [isLoading, setIsLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const page = listComments?.paginate?.page || 1;
  const total = listComments?.paginate?.total || 1;
  const size = listComments?.paginate?.size || 1;
  const totalPages = Math.ceil(total / size);
  const [charCount, setCharCount] = useState<number>(0);

  useEffect(() => {
    setCommentCount(listComments?.data?.length === 0 ? 0 : total);
  }, [listComments]);

  const handleComment = () => {
    if (!authen?.isLogin) {
      return;
    }
    setCommentLoading(true);
    commentPost(
      { id: postId, content: commentValue },
      {
        onSuccess() {
          commentRefetch();
          setCommentLoading(false);
          setCommentPaginationParams({
            postId: postId,
            size: 5,
            page: 1,
          });
          setCommentValue("");
          setCharCount(0);
        },
      },
    );
  };

  const handleClickFavorite = (commentId: number) => {
    if (!authen?.isLogin) {
      return;
    }
    setIsLoading(true);
    reactComment(
      { commentId },
      {
        onSuccess() {
          setIsLoading(false);
          commentRefetch();
        },
      },
    );
  };

  const handleDeleteClickFavorite = (commentId: number) => {
    if (!authen?.isLogin) {
      return;
    }
    setIsLoading(true);
    deleteReactComment(
      { commentId },
      {
        onSuccess() {
          setIsLoading(false);
          commentRefetch();
        },
      },
    );
  };
  return (
    <Box>
      <Box
        sx={{
          pb: "16px",
          borderBottom: "1px solid",
          borderColor: "grey.900",
        }}
      >
        <Typography variant="h5" textTransform="uppercase">
          {formatMessage({ id: "blogDetailPage.comment" })}
        </Typography>
      </Box>
      <Box>
        {listComments?.data?.length === 0 ? (
          <Box></Box>
        ) : (
          listComments?.data?.map((comment, index) => {
            return (
              <Box
                key={index}
                borderBottom="1px solid"
                borderColor="grey.900"
                mt={1}
              >
                <Box>
                  <Box display="flex">
                    {comment.user.firstName === null &&
                    comment.user.lastName === null ? (
                      <Box>
                        <Typography variant="subtitle1">
                          {formatMessage({ id: "blogDetailPage.userUnknown" })}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="subtitle1">
                          {comment.user.firstName}
                        </Typography>
                        <Typography ml={0.5} variant="subtitle1">
                          {comment.user.lastName}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Typography variant="body2" color="grey.700">
                    {formatDayTime(comment.insertedAt, locale)}
                  </Typography>
                </Box>
                <Box p={1}>
                  <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                    {comment.content}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <IconButton
                    color="primary"
                    aria-label="favorite"
                    disabled={isLoading || !authen?.isLogin}
                    sx={{ "&.Mui-disabled": { color: "primary.main" } }}
                  >
                    {comment.alreadyReaction && authen?.isLogin ? (
                      <FavoriteIcon
                        onClick={() => handleDeleteClickFavorite(comment.id)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        onClick={() => handleClickFavorite(comment.id)}
                      />
                    )}
                  </IconButton>
                  <Typography variant="body1">{comment.heartCount}</Typography>
                </Box>
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
              if (page === listComments?.paginate?.page) {
                return;
              }
              const newFilterPrams = { ...commentPaginationParams, page: page };
              setCommentPaginationParams(newFilterPrams);
            }}
            shape="rounded"
            count={totalPages}
            page={page}
            boundaryCount={1}
          />
        )}
      </Box>

      <Box mt={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Box flex={isPC ? 5 : 4} position="relative">
            <Box
              position="absolute"
              bottom={4}
              right={0}
              display="flex"
              alignItems="center"
            >
              <Typography variant="overline" lineHeight="normal">
                {charCount}/1000
              </Typography>
            </Box>
            <Box width="100%">
              <TextField
                label={labelComment}
                variant="standard"
                sx={{ width: "100%" }}
                multiline={true}
                value={commentValue}
                onChange={(e) => {
                  const limit = 1000;
                  let values = e.target.value.slice(0, limit);
                  setCharCount(values.split("").length);
                  setCommentValue(values);
                }}
              />
            </Box>
          </Box>
          {commentValue && (
            <Box
              mt={1}
              flex={isPC ? 1 : 2}
              display="flex"
              justifyContent="flex-end"
              ml={1}
            >
              <Button
                variant="contained"
                fullWidth
                size="medium"
                onClick={handleComment}
                disabled={commentLoading || !authen.isLogin}
              >
                {commentLoading ? (
                  <CircularProgress size={28} color="inherit" />
                ) : (
                  formatMessage({ id: "blogDetailPage.comment" })
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const LcBlogComment = memo(LcBlogCommentComponent, isEqual);
