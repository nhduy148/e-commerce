import { memo, useContext, useEffect, useRef, useState } from "react";

import { useSnackbar } from "notistack";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

import { AuthenticationContext } from "@hera/contexts";
import {
  IProductDetail,
  useCurrentUser,
  useProductReviewMutation,
  useUploadImageMutation,
} from "@hera/data";
import { LcLoadingButton } from "@lc/components";
import { IMAGE_MAX_SIZE, REVIEW_IMAGES_TOTAL_SIZE } from "@lc/constants";
import { FileUpload as FileUploadIcon } from "@mui/icons-material";
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

interface Props {
  product: IProductDetail;
}

const LcProductDetailSendRatingComponent = ({ product }: Props) => {
  const [reviewStars, setReviewStars] = useState(5);
  const theme = useTheme();
  const [reviewContent, setReviewContent] = useState<string>("");
  const { formatMessage } = useIntl();
  const [charCount, setCharCount] = useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const { isLogin } = useContext(AuthenticationContext);
  const [imageQuantity, setImageQuantity] = useState<number>(0);

  const uploadImageButtonRef = useRef<HTMLInputElement>(null);
  const { data: userInfo } = useCurrentUser(isLogin);
  const fullName = [userInfo?.user?.firstName, userInfo?.user?.lastName]
    .filter(Boolean)
    .join(" ");
  const { mutate: uploadReviewProduct, isLoading: isPostingReview } =
    useProductReviewMutation();
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const { mutateAsync: uploadImage } = useUploadImageMutation();
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);

  const resetFormState = () => {
    setReviewContent("");
    setCharCount(0);
    setImageQuantity(0);
    uploadImageButtonRef.current.value = "";
  };

  useEffect(() => {
    resetFormState();
  }, [product?.id]);

  const validateForm = () => {
    if (errorMessage) {
      return false;
    }
    if (!imageQuantity && charCount >= 10) {
      return true;
    }
    if (imageQuantity && imageQuantity <= 5 && charCount >= 10) {
      return true;
    }
    return false;
  };

  const validateUploadImages = (_imageFiles: any) => {
    let fileSize = [];

    const imageFiles = [...Object.values(_imageFiles)] as File[];
    const totalSize = imageFiles.reduce(
      (acc, file) => acc + (file?.size || 0),
      0,
    );

    const imagesFilesTypes = imageFiles.reduce(
      (acc, file) => acc.concat(file.type),

      [] as string[],
    );

    imageFiles.forEach((file) => {
      fileSize.push(file.size);
    });

    if (imageFiles.length > 5) {
      setErrorMessage(formatMessage({ id: "productDetail.tooManyImages" }));
      return false;
    }

    if (totalSize > REVIEW_IMAGES_TOTAL_SIZE) {
      setErrorMessage(formatMessage({ id: "productDetail.totalFileTooLarge" }));
      return false;
    }

    if (
      imageFiles.length > 0 &&
      !(
        imagesFilesTypes.includes("image/jpeg") ||
        imagesFilesTypes.includes("image/png") ||
        imagesFilesTypes.includes("image/gif")
      )
    ) {
      setErrorMessage(formatMessage({ id: "productDetail.wrongFileType" }));
      return false;
    }

    if (fileSize.some((size) => size > IMAGE_MAX_SIZE)) {
      setErrorMessage(formatMessage({ id: "productDetail.fileTooLarge" }));
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSelectedImagesChange = (e) => {
    setImageQuantity(e.target.files.length);
    validateUploadImages(e.target.files);
  };

  const getReviewImageUrls = async () => {
    const imageFiles = [...Object.values(uploadImageButtonRef?.current?.files)];

    return Promise.all(
      // map imageFiles into promises
      imageFiles.map(async (file) => {
        try {
          setIsUploadingImages(true);
          const dataPayload = new FormData();
          dataPayload.append("file", file);

          const { data } = await uploadImage({ data: dataPayload });

          return data.url;
        } catch (error) {
          setIsUploadingImages(false);
          return null;
        }
      }),
    );
  };

  const handleReviewProduct = async () => {
    if (!validateForm()) {
      return;
    }

    const imageUrls = await getReviewImageUrls();

    const reviewPayload = {
      productId: product?.id,
      data: {
        point: reviewStars,
        content: reviewContent,
        imageUrls: imageUrls,
      },
    };

    uploadReviewProduct(reviewPayload, {
      onSuccess() {
        setReviewContent("");
        setCharCount(0);

        enqueueSnackbar(pageContent.reviewAlert, { variant: "success" });
        uploadImageButtonRef.current.value = "";
        setIsUploadingImages(false);
        setImageQuantity(
          [...Object.values(uploadImageButtonRef.current.files)].length,
        );
      },
      onError() {
        setIsUploadingImages(false);
        enqueueSnackbar(pageContent.reviewAlertWrong, { variant: "error" });
      },
    });
  };

  const pageContent = {
    sendReview: formatMessage({ id: "productDetail.sendReview" }),
    leaveComment: formatMessage({ id: "text.leaveComment" }),
    send: formatMessage({ id: "button.send" }),
    contents: formatMessage({ id: "productDetail.contents" }),
    reviewAlert: formatMessage({ id: "productDetail.reviewAlert" }),
    reviewAlertWrong: formatMessage({ id: "productDetail.reviewAlertWrong" }),
    minChar: formatMessage({ id: "productDetail.minChar" }),
  };

  return (
    <Box>
      <Box
        mt={{ xs: 2, sm: 0 }}
        px={3}
        py={4}
        sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.88) }}
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
                value={fullName.length === 0 ? "Khách" : fullName}
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
            <Box mt={2} mb={4} position="relative">
              <Box
                position="absolute"
                bottom={0}
                right={0}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                px={1.5}
                py={1.5}
              >
                <Typography
                  variant="overline"
                  lineHeight="normal"
                  textTransform="none"
                >
                  {pageContent.minChar}
                </Typography>
                <Typography variant="overline" lineHeight="normal">
                  {charCount}/1000
                </Typography>
              </Box>
              <Box p={1.5} pb={3} sx={{ backgroundColor: "white" }}>
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
            <Button
              variant="outlined"
              color="primary"
              aria-label="upload picture"
              component="label"
              startIcon={<FileUploadIcon />}
            >
              <input
                onChange={(e) => {
                  handleSelectedImagesChange(e);
                }}
                hidden
                multiple
                accept="image/jpeg, image/png, image/jpg"
                type="file"
                ref={uploadImageButtonRef}
              />

              <Typography variant="body2">
                {imageQuantity > 0 && !errorMessage
                  ? formatMessage(
                      { id: "productDetail.imagesChosen" },
                      { imageQuantity },
                    )
                  : formatMessage({ id: "productDetail.uploadImage" })}
              </Typography>
            </Button>
            {errorMessage && (
              <Box mt={2}>
                <Typography color="error">{errorMessage}</Typography>
              </Box>
            )}
            <Box mt={4}>
              <LcLoadingButton
                isLoading={isPostingReview || isUploadingImages}
                variant="contained"
                size="large"
                disabled={!validateForm()}
                sx={{ width: "136px" }}
                onClick={handleReviewProduct}
              >
                {pageContent.send}
              </LcLoadingButton>
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

export const LcProductDetailSendRating = memo(
  LcProductDetailSendRatingComponent,
  isEqual,
);
