import { IProductReviewItem, IProductReviewPayload } from "@hera/data";
import { Image } from "@hera/ui";
import { formatDetailDayTime } from "@hera/utils";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  lighten,
  Pagination,
  Rating,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import { CommentImg } from "@nestle/static/images";
import { memo, useLayoutEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const StyledBox = styled(Box)`
  border-right: 1px solid;
  border-color: ${({ theme }) => theme.palette.grey[300]};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    border: none;
  }
`;
interface Props {
  productReviews: any;
  ratingAvg: number;
  reviewItem: IProductReviewItem[];
  commentPaginationParams: IProductReviewPayload;
  setCommentPaginationParams: (e) => void;
}
interface ICommentProps {
  commentItem: IProductReviewItem;
}
export const CommentComponent = ({ commentItem }: ICommentProps) => {
  const { locale } = useIntl();
  const isPC = useBreakPoint("sm");
  const fullName = [commentItem.user.firstName, commentItem.user.lastName]
    .filter(Boolean)
    .join(" ");
  const theme = useTheme();
  return (
    <Box mb={2}>
      <Box
        sx={{
          backgroundColor: theme.palette.grey[50],
          borderRadius: "10px",
          border: "1px solid",
          borderColor: lighten(theme.palette.primary.main, 0.9),
        }}
        p={{ sm: 3, xs: 2 }}
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Box>
              <Image
                src={CommentImg.src}
                width={isPC ? 56 : 44}
                height={isPC ? 56 : 44}
                alt="Comment Img"
              />
            </Box>
          </Box>
          <Box>
            <StyledBox pl={3}>
              <Box display="flex" pr={3}>
                <Typography variant="h6">
                  {fullName.length === 0 ? "User Unknown" : fullName}
                </Typography>
              </Box>
              <Rating
                name="read-only"
                value={commentItem.point}
                readOnly
                size="medium"
                sx={{ display: { sm: "none", xs: "flex" } }}
              />
            </StyledBox>
          </Box>
          <Box>
            <StyledBox
              pl={3}
              sx={{ pr: { xs: 0, sm: 3 }, pl: { xs: 2, sm: 3 } }}
            >
              <Typography
                color="grey.500"
                sx={{
                  alignItems: { sm: "flex-start", xs: "flex-end" },
                  display: { sm: "block", xs: "none" },
                }}
                variant="h6"
              >
                {formatDetailDayTime(commentItem.insertedAt, locale)}
              </Typography>
              <Box
                sx={{
                  justifyContent: "flex-end",
                  display: { sm: "none", xs: "flex" },
                }}
              >
                <Typography color="grey.500" variant="caption">
                  {formatDetailDayTime(commentItem.insertedAt, locale)}
                </Typography>
              </Box>
            </StyledBox>
          </Box>

          <Box
            pl={3}
            sx={{
              "& > legend": { mt: 2 },
              display: { sm: "block", xs: "none" },
            }}
          >
            <Rating
              name="read-only"
              value={commentItem.point}
              readOnly
              size="medium"
            />
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
            {commentItem.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
const NesProductDetailCommentComponent = ({
  productReviews,
  ratingAvg,
  reviewItem,
  setCommentPaginationParams,
  commentPaginationParams,
}: Props) => {
  const { formatMessage } = useIntl();
  const pageContent = {
    customerReviews: formatMessage({ id: "productDetail.customerReviews" }),
    loadMore: formatMessage({ id: "productDetail.loadMore" }),
    noReview: formatMessage({ id: "productDetail.noReview" }),
  };

  const reviewLength = reviewItem?.length;
  const page = productReviews?.paginate?.page || 1;
  const total = productReviews?.paginate?.total || 1;
  const size = productReviews?.paginate?.size || 1;
  const totalPages = Math.ceil(total / size);

  const commentHeightRef = useRef(null);
  const isPC = useBreakPoint("sm");
  const [commentHeight, setCommentHeight] = useState(500);
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };
  useLayoutEffect(() => {
    setCommentHeight(commentHeightRef?.current?.offsetHeight);
  }, [isPC]);
  setTimeout(() => {
    setCommentHeight(commentHeightRef?.current?.offsetHeight);
  }, 500);
  const pointHeight = isPC ? 500 : 300;
  return (
    <Box mt={4.25}>
      <Box sx={{ display: { sm: "flex", xs: "none" } }} alignItems="center">
        <Box display="flex" alignItems="flex-end">
          <Typography color="primary" variant="h3">
            {ratingAvg || 0.0}/
          </Typography>
          <Typography color="primary" variant="h4">
            5.0
          </Typography>
        </Box>
        <Box ml={1.75}>
          <Typography color="grey.400">{`(${productReviews?.paginate?.total} ${pageContent.customerReviews})`}</Typography>
        </Box>
      </Box>
      <Box mt={2}>
        <Box position="relative">
          <Collapse in={checked} collapsedSize={500}>
            <Box ref={commentHeightRef}>
              {reviewItem?.length === 0 ? (
                <Box>
                  <Typography variant="h5">{pageContent.noReview}</Typography>
                </Box>
              ) : (
                reviewItem?.map((data, index) => {
                  return (
                    <Box key={index}>
                      <CommentComponent commentItem={data} />
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
                    if (page === productReviews?.paginate?.page) {
                      return;
                    }
                    const newFilterPrams = {
                      ...commentPaginationParams,
                      page: page,
                    };
                    setCommentPaginationParams(newFilterPrams);
                  }}
                  shape="rounded"
                  count={totalPages}
                  page={page}
                  boundaryCount={1}
                />
              )}
            </Box>
          </Collapse>
          {!checked && commentHeight > pointHeight && (
            <Box
              sx={{
                background: `linear-gradient(to bottom,rgba(255 247 236/0),rgba(255 247 236/62.5),rgba(255 247 236/1))`,
                bottom: "0",
                height: "105px",
                left: "0",
                position: "absolute",
                width: "100%",
                borderRadius: "4px",
              }}
            ></Box>
          )}
        </Box>
      </Box>
      {commentHeight > pointHeight && (
        <Box width="100%" display="flex" justifyContent="center" mt={1}>
          <Button
            onClick={handleChange}
            endIcon={
              checked ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
            }
            size="large"
          >
            {checked
              ? formatMessage({ id: "productDetail.hidden" })
              : formatMessage({ id: "productDetail.more" })}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const NesProductDetailComment = memo(
  NesProductDetailCommentComponent,
  isEqual,
);
