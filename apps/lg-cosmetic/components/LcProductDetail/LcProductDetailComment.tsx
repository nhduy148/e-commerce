import { IProductReviewItem, IProductReviewPayload } from "@hera/data";
import { useBreakPoint } from "@lc/hooks";
import { Box, Pagination, Typography } from "@mui/material";

import { LcProductDetailCommentItem } from "@lc/components";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

interface Props {
  productReviews: any;
  ratingAvg: number;
  reviewItem: IProductReviewItem[];
  commentCount: number;
  commentPaginationParams: IProductReviewPayload;
  setCommentPaginationParams: (e) => void;
  setCommentCount: (e) => void;
}
const LcProductDetailCommentComponent = ({
  productReviews,
  ratingAvg,
  reviewItem,
  commentCount,
  setCommentPaginationParams,
  commentPaginationParams,
  setCommentCount,
}: Props) => {
  const isPC = useBreakPoint("sm");
  const { formatMessage } = useIntl();
  const [checked, setChecked] = useState(false);
  const descriptionRef = useRef(null);
  const handleChange = () => {
    setChecked(!checked);
  };
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

  useEffect(() => {
    setCommentCount(reviewItem?.length === 0 ? 0 : total);
  }, [reviewItem]);

  const [descriptionHeight, setDescriptionHeight] = useState(500);

  useLayoutEffect(() => {
    setDescriptionHeight(descriptionRef?.current?.offsetHeight);
  }, [descriptionRef, isPC]);

  setTimeout(() => {
    setDescriptionHeight(descriptionRef?.current?.offsetHeight);
  }, 500);

  return (
    <Box mt={4.25}>
      <Box sx={{ display: { sm: "flex", xs: "none" } }} alignItems="center">
        <Box display="flex" alignItems="flex-end">
          <Typography color="primary" variant="h3">
            {productReviews?.paginate?.total > 0
              ? Number(ratingAvg).toFixed(1)
              : "5.0"}
            /
          </Typography>
          <Typography color="primary" variant="h4">
            5.0
          </Typography>
        </Box>
        <Box ml={1.75}>
          <Typography color="grey.400">{`(${commentCount} ${pageContent.customerReviews})`}</Typography>
        </Box>
      </Box>
      <Box mt={2}>
        <Box position="relative">
          <Box ref={descriptionRef}>
            {reviewItem?.length === 0 ? (
              <Box>
                <Typography variant="h5">{pageContent.noReview}</Typography>
              </Box>
            ) : (
              reviewItem?.map((data, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "grey.A100",
                      p: { sm: 3, xs: 2 },
                      mb: 3,
                    }}
                  >
                    <Box>
                      <LcProductDetailCommentItem commentItem={data} />
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
        </Box>
      </Box>
    </Box>
  );
};

export const LcProductDetailComment = memo(
  LcProductDetailCommentComponent,
  isEqual,
);
