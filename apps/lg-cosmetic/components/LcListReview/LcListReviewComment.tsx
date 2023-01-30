import { IProductReviewItem, IReviewImage } from "@hera/data";
import { BREAK_POINTS } from "@lc/constants";
import { useBreakPoint } from "@lc/hooks";
import { stringAvatar } from "@lc/utils";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Rating,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { memo, useCallback, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import Slider, { Settings as SlickSliderSettings } from "react-slick";
import { LcIconButton } from "../LcIconButton";

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
  slidesToShow: 4,
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

interface Props {
  reviewItem?: IProductReviewItem;
}

const LcListReviewCommentComponent = ({ reviewItem }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { formatMessage, locale } = useIntl();
  const isPC = useBreakPoint("sm");
  const fullName = [reviewItem?.user?.lastName, reviewItem?.user?.firstName]
    .filter(Boolean)
    .join(" ");

  const handleDetailReview = (e) => {
    e.preventDefault();
    const reviewVariables = {
      openReviewList: true,
      reviewId: reviewItem?.id,
    };
    localStorage.setItem("reviewRoute", JSON.stringify(reviewVariables));
    router.push(`products/${reviewItem?.product?.slug}`);
  };

  const sliderRef = useRef<Slider>();
  const previewSliderRef = useRef<Slider>();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [switchingImage, setWitchImage] = useState<boolean>(false);

  const renderImage = useCallback((image: IReviewImage, index: number) => {
    return (
      <Box
        px={{ xs: 0.25, sm: 1 }}
        sx={{
          flex: { sm: "0 1 25%", xs: "0 1 50%" },
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
              alt={reviewItem?.point.toString()}
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
              {reviewItem?.images.map((image) => (
                <Box p={1.25} key={image.id}>
                  {isPC ? (
                    <Box position="relative" paddingTop="100%">
                      <StyledImage
                        src={image?.imageOriginalUrl}
                        alt={reviewItem?.point.toString()}
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
                        alt={reviewItem?.point.toString()}
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

  return (
    <Box mb="24px">
      <Box display={isPC ? "flex" : "block"}>
        <Box>
          <Avatar
            {...stringAvatar(fullName)}
            sx={{ bgcolor: theme.palette.primary.main }}
          />
        </Box>
        <Box flex="1" ml={isPC ? "12px" : "0"} mt={isPC ? "0px" : "12px"}>
          <Box>
            <Typography>
              <b>{fullName.length > 0 ? fullName : "Khách"}</b>
              {` đã viết đánh giá cho sản phẩm `}
              <Link
                sx={{ color: theme.palette.common.black }}
                underline="hover"
                href={`products/${reviewItem?.product?.slug}`}
                onClick={handleDetailReview}
              >
                <b>{reviewItem?.product?.name}</b>
              </Link>
            </Typography>
          </Box>
          <Box display={isPC ? "flex" : "block"} mt="10px">
            <Rating
              sx={{ fontSize: "16px" }}
              name="read-only"
              value={reviewItem?.point as number}
              readOnly
            />
            <Box ml={isPC ? 1 : 0} mt={isPC ? 0 : 1} display="flex">
              <Typography variant="body2">
                {`Đánh giá lúc: `}
                {dayjs(reviewItem?.insertedAt).format("h:mm A DD/MM/YYYY")}
              </Typography>
              {/* <Box display="flex" ml={2}>
                <AiOutlineComment />
                <Typography variant="body2" pl="4px">
                  <b>4</b>
                </Typography>
              </Box> */}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt="20px" sx={{ wordBreak: "break-word" }}>
        <Typography variant="body2">{reviewItem?.content}</Typography>
      </Box>
      {reviewItem?.images?.length > 0 && (
        <Box mt={2}>
          {(reviewItem?.images || []).length <= (isPC ? 4 : 2) ? (
            <Box mx={{ xs: -0.5, sm: -1 }} display="flex" flexDirection="row">
              {reviewItem?.images.map(renderImage)}
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
                {reviewItem?.images.map(renderImage)}
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
      <Box
        mt={1}
        pb={1}
        display="flex"
        justifyContent={isPC ? "flex-end" : "center"}
      >
        <Button
          variant="text"
          onClick={handleDetailReview}
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: "none" }}
        >
          <Typography variant="body2">Xem chi tiết</Typography>
        </Button>
      </Box>
      <Box
        mx={isPC ? "-32px" : "-16px"}
        sx={{
          borderBottom: "1px solid ",
          borderColor: theme.palette.grey[200],
        }}
      ></Box>
      {renderPreview()}
    </Box>
  );
};

export const LcListReviewComment = memo(LcListReviewCommentComponent, isEqual);
