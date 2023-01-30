import { AuthenticationContext } from "@hera/contexts";
import {
  IProductReviewItem,
  IReviewImage,
  IReviewReply,
  useReviewRepliesQuery,
  useReviewReplyMutation,
} from "@hera/data";
import { formatDetailDayTime } from "@hera/utils";
import {
  LcIconButton,
  LcLoadingButton,
  LcProductReviewReply,
} from "@lc/components";
import { BREAK_POINTS } from "@lc/constants";
import { useBreakPoint } from "@lc/hooks";
import { stringAvatar } from "@lc/utils";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Rating,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useContext, useRef, useState } from "react";

import { useIntl } from "react-intl";
import Slider, { Settings as SlickSliderSettings } from "react-slick";

interface IProps {
  commentItem: IProductReviewItem;
}

const StyledBox = styled(Box)`
  border-right: 1px solid;
  border-color: ${({ theme }) => theme.palette.grey[300]};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    border: none;
  }
`;

export const LcProductDetailCommentItem = ({ commentItem }: IProps) => {
  const { locale } = useIntl();
  const theme = useTheme();
  const isPC = useBreakPoint("sm");
  const { formatMessage } = useIntl();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [replyPageAndSize, setReplyPageAndSize] = useState<{
    page: number;
    size: number;
  }>({
    page: 1,
    size: 1,
  });
  const [replyInputErrorMessage, setReplyInputErrorMessage] =
    useState<string>(null);

  const sliderRef = useRef<Slider>();
  const previewSliderRef = useRef<Slider>();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [switchingImage, setWitchImage] = useState<boolean>(false);

  const renderImage = useCallback((image: IReviewImage, index: number) => {
    return (
      <Box
        px={{ xs: 0.25, sm: 1 }}
        sx={{
          flex: { sm: "0 1 33.33%", xs: "0 1 50%" },
        }}
        key={image?.id}
      >
        <Box
          bgcolor="black"
          sx={{
            cursor: "pointer",
            transition: "300ms",
            ":hover": { opacity: 0.9 },
          }}
          onClick={() => {
            previewSliderRef.current?.slickGoTo(index);
            setShowPreview(true);
            setTimeout(() => {
              setWitchImage(false);
            }, 300);
          }}
        >
          <Box position="relative" paddingTop="100%">
            <StyledImage
              src={image?.imageThumbUrl}
              alt={commentItem?.point.toString()}
            />
          </Box>
        </Box>
      </Box>
    );
  }, []);

  const renderPreview = useCallback(() => {
    return (
      <Backdrop
        open={showPreview}
        transitionDuration={100}
        sx={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.9)" }}
      >
        <Container sx={{ py: 2 }}>
          <Box position="relative" color="white">
            <LcIconButton
              iconName="close"
              color="inherit"
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
              }}
              onClick={() => {
                setWitchImage(true);
                setShowPreview(false);
              }}
            />
            <Box
              sx={{
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                maxWidth: "400px",
                height: "400px",
                transform: "translate(-50%, -50%)",
                visibility: !switchingImage ? "hidden" : "visible",
                opacity: !switchingImage ? 0 : 1,
                display: switchingImage && !showPreview ? "none" : "flex",
              }}
            >
              <CircularProgress />
            </Box>
            <LcIconButton
              active
              size="small"
              iconName="chevron_left"
              onClick={(e) => {
                e.stopPropagation();
                previewSliderRef.current.slickPrev();
              }}
              sx={{
                position: "absolute",
                top: "50%",
                left: "0",
                transform: "translateY(-50%)",
                zIndex: 2,
              }}
            />
            <StyledPreviewSlider
              {...previewSliderSetting}
              ref={previewSliderRef}
              sx={{
                visibility: switchingImage && "hidden",
                opacity: switchingImage && 0,
                transition: "500ms",
              }}
            >
              {commentItem?.images.map((image) => (
                <Box p={1.25} key={image.id}>
                  {isPC ? (
                    <Box position="relative" paddingTop="100%">
                      <StyledImage
                        src={image?.imageOriginalUrl}
                        alt={commentItem?.point.toString()}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{ maxWidth: "100%" }}
                        src={image?.imageOriginalUrl}
                        alt={commentItem?.point.toString()}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </StyledPreviewSlider>
            <LcIconButton
              active
              size="small"
              iconName="chevron_right"
              onClick={(e) => {
                e.stopPropagation();
                previewSliderRef.current.slickNext();
              }}
              sx={{
                position: "absolute",
                top: "50%",
                right: "0",
                transform: "translateY(-50%)",
              }}
            />
          </Box>
        </Container>
      </Backdrop>
    );
  }, [showPreview, switchingImage]);

  const { mutateAsync: createReviewReply, isLoading: creatingReviewReply } =
    useReviewReplyMutation();

  const { isLogin } = useContext(AuthenticationContext);
  const replyInputRef = useRef(null);

  const fullName = [commentItem?.user?.lastName, commentItem?.user?.firstName]
    .filter(Boolean)
    .join(" ");

  const validateReply = (reply: string) => {
    if (reply.trim().length <= 10) {
      setReplyInputErrorMessage(
        formatMessage({ id: "productDetail.replyHasMoreThanTen" }),
      );
      return;
    }
    setReplyInputErrorMessage(null);
  };

  const handleUploadReviewReply = async (reply: string) => {
    try {
      await createReviewReply({
        reviewId: `${commentItem.id}`,
        content: reply,
      });

      enqueueSnackbar(
        formatMessage({
          id: "productDetail.createReplySuccess",
        }),
        {
          variant: "success",
        },
      );

      replyInputRef.current.value = "";
      setReplyPageAndSize({
        ...replyPageAndSize,
        page: 1,
      });
      setIsReplying(false);
      refetchRepliesData();
    } catch (error) {
      enqueueSnackbar(
        formatMessage({
          id: "productDetail.createReplyFail",
        }),
        {
          variant: "error",
        },
      );
    }
  };

  const { data: reviewRepliesData, refetch: refetchRepliesData } =
    useReviewRepliesQuery({
      reviewId: commentItem?.id,
      ...replyPageAndSize,
    });

  const handleChangeRepliesPage = () => {
    if (replyPageAndSize?.size === 1) {
      setReplyPageAndSize({
        ...replyPageAndSize,
        size: 5,
      });
    }
    if (replyPageAndSize?.size !== 1) {
      setReplyPageAndSize({
        ...replyPageAndSize,
        page: replyPageAndSize.page + 1,
      });
    }

    refetchRepliesData();
  };

  return (
    <>
      <Box>
        <Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 3 }}
              alignItems="center"
            >
              <Avatar
                {...stringAvatar(fullName)}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: isPC ? 56 : 44,
                  height: isPC ? 56 : 44,
                }}
              />
              <Box>
                <Typography variant="h6">
                  {fullName.length === 0 ? "Khách" : fullName}
                </Typography>
                <Typography color="grey.500" variant="subtitle2">
                  {formatDetailDayTime(commentItem?.insertedAt, locale)}
                </Typography>
              </Box>
            </Stack>
            <Stack
              width={{ xs: 1, sm: "unset" }}
              flex={1}
              direction="row"
              spacing={{ xs: 0.5, sm: 3 }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Rating
                  name="read-only"
                  value={commentItem?.point}
                  readOnly
                  size="medium"
                />
              </Box>
              {isLogin && (
                <Box flex={1} display="flex" justifyContent="flex-end">
                  <Button
                    variant="text"
                    size="small"
                    color="inherit"
                    onClick={() => {
                      replyInputRef?.current?.focus();
                      setIsReplying(true);
                    }}
                  >
                    <Typography
                      variant="body2"
                      textTransform="initial"
                      fontWeight="500"
                    >
                      {formatMessage({ id: "productDetail.reply" })}
                    </Typography>
                  </Button>
                </Box>
              )}
            </Stack>
          </Stack>
          <Box py={1}>
            <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
              {commentItem?.content}
            </Typography>
          </Box>
          {commentItem?.images?.length > 0 && (
            <Box mt={2}>
              {(commentItem?.images || []).length <= (isPC ? 3 : 2) ? (
                <Box
                  mx={{ xs: -0.5, sm: -1 }}
                  display="flex"
                  flexDirection="row"
                >
                  {commentItem?.images.map(renderImage)}
                </Box>
              ) : (
                <Box position="relative">
                  <LcIconButton
                    active
                    size="small"
                    iconName="chevron_left"
                    onClick={(e) => {
                      e.stopPropagation();
                      sliderRef.current.slickPrev();
                    }}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  />
                  <StyledSlider {...sliderSetting} ref={sliderRef}>
                    {commentItem?.images.map(renderImage)}
                  </StyledSlider>
                  <LcIconButton
                    active
                    size="small"
                    iconName="chevron_right"
                    onClick={(e) => {
                      e.stopPropagation();
                      sliderRef.current.slickNext();
                    }}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "0",
                      transform: "translateY(-50%)",
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
        {reviewRepliesData?.data?.length > 0 && (
          <Box
            sx={{ mt: 1, pt: { xs: 1, sm: 2 } }}
            borderTop="1px solid"
            borderColor="grey.100"
          >
            <Box pl={1.5}>
              {reviewRepliesData?.data?.map(
                (replyData: IReviewReply, index) => (
                  <>
                    {index > 0 && <Divider />}
                    <LcProductReviewReply
                      key={index}
                      replyData={replyData}
                      onReplyButtonPress={() => {
                        setIsReplying(true);
                        replyInputRef?.current?.focus();
                      }}
                    />
                  </>
                ),
              )}
            </Box>
            {reviewRepliesData?.paginate?.page <
              reviewRepliesData?.paginate?.totalPages && (
              <Box display="flex" justifyContent="center">
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handleChangeRepliesPage}
                >
                  {formatMessage({ id: "productDetail.loadMore" })}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
      {isReplying && (
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            error={replyInputErrorMessage ? true : false}
            helperText={replyInputErrorMessage}
            sx={{
              width: "100%",
            }}
            InputProps={{
              sx: {
                backgroundColor: theme.palette.common.white,
              },
            }}
            inputRef={replyInputRef}
            onChange={(e) => validateReply(e.target.value)}
            FormHelperTextProps={{
              sx: {
                mx: 0,
              },
            }}
          />
          <LcLoadingButton
            isLoading={creatingReviewReply}
            disabled={Boolean(replyInputErrorMessage)}
            variant="contained"
            size="small"
            sx={{
              display: "flex",
              ml: "auto",
              mt: 1.5,
              width: "fit-content",
            }}
            onClick={() => {
              handleUploadReviewReply(replyInputRef.current.value.trim());
            }}
          >
            {formatMessage({ id: "button.send" })}
          </LcLoadingButton>
        </Box>
      )}
      {renderPreview()}
    </>
  );
};

const StyledSlider = styled(Slider)`
  margin: 0 auto;
  max-width: calc(100% - (56px));
  ${({ theme }) => theme.breakpoints.up("sm")} {
    max-width: calc(100% - (56px + 32px));
  }
`;

const StyledPreviewSlider = styled(Slider)`
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    max-width: calc(100% - (56px + 32px));
  }
  .slick-slide {
    padding: 10px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    .slick-slide {
      height: calc(100vh - 80px);
      > div {
        height: 100%;
        > div {
          height: 100%;
          > div {
            height: 100%;
          }
        }
      }
    }
  }
`;

const sliderSetting: SlickSliderSettings = {
  arrows: false,
  dots: false,
  infinite: true,
  slidesToScroll: 1,
  slidesToShow: 3,
  slidesPerRow: 1,
  centerMode: false,
  centerPadding: "8px",
  rows: 1,
  adaptiveHeight: true,
  responsive: [
    {
      breakpoint: BREAK_POINTS.sm,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const previewSliderSetting: SlickSliderSettings = {
  arrows: false,
  dots: false,
  infinite: true,
  autoplay: false,
  slidesToScroll: 1,
  slidesToShow: 1,
  slidesPerRow: 1,
  fade: true,
  rows: 1,
  lazyLoad: "ondemand",
};

const StyledImage = styled("img")`
  position: absolute;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    top: 10px;
    left: 10px;
    bottom: 10px;
    right: 10px;
    height: calc(100% - 20px);
    width: calc(100% - 20px);
  }
  top: 4px;
  left: 4px;
  bottom: 4px;
  right: 4px;
  max-height: 100%;
  max-width: 100%;
  height: calc(100% - 8px);
  width: calc(100% - 8px);
  object-fit: contain;
  object-position: center;
`;
