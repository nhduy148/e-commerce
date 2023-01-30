import { AuthenticationContext } from "@hera/contexts";
import {
  ICreateCommentPayload,
  IProductDetail,
  useCurrentUser,
  useReviewProduct,
} from "@hera/data";
import {
  Box,
  Button,
  Input,
  lighten,
  Rating,
  styled,
  TextareaAutosize,
  Typography,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { memo, useContext, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
interface Props {
  product: IProductDetail;
  setCommentPaginationParams: (e) => void;
  productReviewRefetch: () => void;
  productDetailRefetch: () => void;
}
const NesProductDetailSendRatingComponent = ({
  product,
  setCommentPaginationParams,
  productReviewRefetch,
  productDetailRefetch,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [reviewStars, setReviewStars] = useState(5);
  const theme = useTheme();
  const [reviewContent, setReviewContent] = useState<string>("");
  const { formatMessage } = useIntl();
  const [charCount, setCharCount] = useState<number>(0);
  const { isLogin } = useContext(AuthenticationContext);

  const pageContent = {
    sendReview: formatMessage({ id: "productDetail.sendReview" }),
    leaveComment: formatMessage({ id: "text.leaveComment" }),
    send: formatMessage({ id: "button.send" }),
    contents: formatMessage({ id: "productDetail.contents" }),
    ratingSuccess: formatMessage({ id: "productDetail.ratingSuccess" }),
    ratingFailed: formatMessage({ id: "productDetail.ratingFailed" }),
  };
  const { data: userInfo } = useCurrentUser(isLogin);
  const fullName = [userInfo?.user?.firstName, userInfo?.user?.lastName]
    .filter(Boolean)
    .join(" ");

  const { mutate: reviewProductMutation } = useReviewProduct();

  const handleReviewProduct = () => {
    let dataPayload = new FormData();

    dataPayload.append("content", reviewContent.trim());
    dataPayload.append("point", reviewStars.toString());

    const payload = {
      data: dataPayload,
      productId: product.id,
    } as ICreateCommentPayload;

    if (charCount < 10) {
      return;
    }
    reviewProductMutation(payload, {
      onSuccess() {
        enqueueSnackbar(pageContent.ratingSuccess, { variant: "success" });
        setReviewContent("");
        setCharCount(0);
        setCommentPaginationParams({
          productId: product?.id,
          size: 5,
          page: 1,
        });
        productDetailRefetch();
        productReviewRefetch();
      },
      onError() {
        enqueueSnackbar(pageContent.ratingFailed, { variant: "error" });
      },
    });
  };
  return (
    <Box>
      <Box
        mt={{ xs: 2, sm: 0 }}
        px={3}
        py={4}
        sx={{
          backgroundColor: lighten(theme.palette.primary.main, 0.88),
          borderRadius: "10px",
        }}
      >
        <Box>
          <Typography color="primary" variant="h5" textTransform="uppercase">
            {pageContent.sendReview}
          </Typography>
        </Box>
        <Box pt={1.5}>
          <Typography>{pageContent.leaveComment}</Typography>
        </Box>
        <Box mt={3.25}>
          <Rating
            name="simple-controlled"
            value={reviewStars}
            onChange={(event, star) => {
              setReviewStars(star);
            }}
          />
          <Box mt={5.25}>
            <Box>
              <Input
                placeholder="Tên của bạn"
                disableUnderline
                value={
                  fullName.length === 0
                    ? `${formatMessage({ id: "productDetail.guest" })}`
                    : fullName
                }
                disabled
                sx={{
                  bgcolor: "common.white",
                  height: "56px",
                  width: "100%",
                  px: "16px",
                }}
              />
            </Box>
            <Box mt={2}>
              <Input
                placeholder="Email"
                disableUnderline
                value={userInfo?.user?.email}
                disabled
                sx={{
                  bgcolor: "common.white",
                  height: "56px",
                  width: "100%",
                  px: "16px",
                }}
              />
            </Box>
            <Box mt={2} position="relative">
              <Box
                position="absolute"
                bottom={0}
                right={0}
                display="flex"
                alignItems="center"
                pr={1.5}
              >
                <Typography variant="overline" lineHeight="normal">
                  {charCount}/1000
                </Typography>
              </Box>
              <Box p={1.5} sx={{ backgroundColor: "white" }}>
                <StyledTextareaAutosize
                  placeholder={pageContent.contents}
                  maxRows={4}
                  value={reviewContent}
                  onChange={(e) => {
                    const limit = 1000;
                    let values = e.target.value.slice(0, limit);
                    setCharCount(values.trim().split("").length);
                    setReviewContent(values);
                  }}
                  style={{
                    width: "100%",
                    height: 144,
                    outline: "none",
                    border: "none",
                    font: "inherit",
                  }}
                />
              </Box>
            </Box>
            <Box mt={4}>
              <Button
                variant="contained"
                size="large"
                disabled={charCount < 10 ? true : false}
                sx={{ width: "136px" }}
                onClick={handleReviewProduct}
              >
                {pageContent.send}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const StyledTextareaAutosize = styled(TextareaAutosize)`
  resize: none;
  &::placeholder {
    color: #b0b0b0;
  }
`;

export const NesProductDetailSendRating = memo(
  NesProductDetailSendRatingComponent,
  isEqual,
);
