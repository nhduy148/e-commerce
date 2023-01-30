import * as config from "@hera/config";
import { AuthenticationContext } from "@hera/contexts";
import {
  GET_JUST_FOR_YOU,
  IProductDetail,
  useAddWishlist,
  useGetProductReviews,
  useRemoveWishlist,
  USER_WISHLIST,
} from "@hera/data";
import { Image as ImageWithFallback } from "@hera/ui";
import { toCurrency } from "@hera/utils";
import { LcIconButton, LcLoadingButton } from "@lc/components";
import { useAddToCart, useBreakPoint } from "@lc/hooks";
import { gtmEvent, metaPixelEvent } from "@lc/libs";
import { FallbackImage600x300, FlashSaleImg, QRImage } from "@lc/static/images";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSnackbar, VariantType } from "notistack";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";
import { FacebookShareButton } from "react-share";
import Slider from "react-slick";
import { LcInputCount, LcRealTimeSale } from "./index";

const settings = {
  arrows: false,
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const StyledSliderItem = styled(Box)`
  position: relative;
  padding-top: 100%;
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  display: flex;

  .slick-track {
    height: 100%;
  }

  .slick-list {
    width: 100%;
  }

  .slick-slide {
    height: 100%;

    & > div {
      width: 100%;
      height: 100%;
    }
  }
`;
interface Props {
  productDetail: IProductDetail;
  commentCount: number;
  productDetailRefetch: () => void;
}

const LcProductDetailInfoComponent = ({
  productDetail: product,
  commentCount,
  productDetailRefetch,
}: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { isLogin: isLogin } = useContext(AuthenticationContext);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [alreadyWishlist, setWishlist] = useState<boolean>(
    Boolean(product?.alreadyWishlist),
  );
  const isOutOfStock: boolean = product.inStock <= 0;
  const queryClient = useQueryClient();

  useEffect(() => {
    setWishlist(Boolean(product?.alreadyWishlist));
    gtmEvent("view_item", product);
    metaPixelEvent("ViewContent", product);
  }, [product]);

  const { formatMessage } = useIntl();

  const isPC = useBreakPoint("sm");
  const pageContent = {
    customerReviews: formatMessage({ id: "productDetail.customerReviews" }),
    addToCart: formatMessage({ id: "button.addToCart" }),
    share: formatMessage({ id: "button.share" }),
    category: formatMessage({ id: "productDetail.category" }),
    keyWord: formatMessage({ id: "productDetail.keyWord" }),
    addToFavorite: formatMessage({ id: "productDetail.addToFavorite" }),
    endAfter: formatMessage({ id: "productDetail.endAfter" }),
    sold: formatMessage({ id: "productDetail.sold" }),
    products: formatMessage({ id: "productDetail.products" }),
    removeFromFavorite: formatMessage({
      id: "productDetail.removeFromFavorite",
    }),
    addWishlistSuccess: formatMessage({ id: "wishlist.addSuccess" }),
    addWishlistFailure: formatMessage({ id: "wishlist.addFailure" }),
    removeWishlistSuccess: formatMessage({ id: "wishlist.removeSuccess" }),
    removeWishlistFailure: formatMessage({ id: "wishlist.removeFailure" }),
    outOfStock: formatMessage({ id: "common.outOfStock" }),
    buyNow: formatMessage({ id: "productDetail.buyNow" }),
  };

  const [isAdding, setAdding] = useState<boolean>(false);
  const [isBuying, setBuying] = useState<boolean>(false);
  const [isAddingWishlist, setAddingWishlist] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const sliderRef = useRef<any>(null);
  const _handleAddToCart = useAddToCart();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: removeWishlistAsync } = useRemoveWishlist();
  const { mutateAsync: addWishlistAsync } = useAddWishlist();
  const maxAddQuantity = useMemo(() => {
    if (product?.inStock < product?.maxInCart) {
      return product.inStock;
    }
    return product.maxInCart;
  }, [product]);

  const handleAddToCart = async (event: any) => {
    event.stopPropagation();
    if (isAdding || isBuying) {
      return;
    }
    setAdding(true);
    _handleAddToCart(
      { quantity, product },
      { finallyCallback: () => setAdding(false) },
    );
  };

  const handleBuyNow = async (event: any) => {
    event.stopPropagation();
    if (isAdding || isBuying) {
      return;
    }
    setBuying(true);
    await _handleAddToCart(
      {
        quantity,
        product,
      },
      {},
      true,
    );
    await router.push("/checkout");
    setBuying(false);
  };

  const handleWishlistActions = async (event) => {
    event.stopPropagation();
    let message = "";
    let variant: VariantType = "success";
    const id = product.id;
    if (!id) return;
    setAddingWishlist(true);
    try {
      if (alreadyWishlist) {
        await removeWishlistAsync({ id });
        message = pageContent.removeWishlistSuccess;
      } else {
        await addWishlistAsync({ id });
        message = pageContent.addWishlistSuccess;
      }
      setWishlist((current) => !current);
      queryClient.fetchQuery(GET_JUST_FOR_YOU);
      queryClient.fetchQuery([USER_WISHLIST, {}]);
      variant = "success";
    } catch (error) {
      if (alreadyWishlist) {
        message = pageContent.removeWishlistFailure;
      } else {
        message = pageContent.addWishlistFailure;
      }
      variant = "error";
    } finally {
      enqueueSnackbar(message, { variant });
      setAddingWishlist(false);
    }
  };
  //@ts-ignore
  const { data: getProductReviews } = useGetProductReviews({
    sortBy: "latest",
    productId: product?.id,
    size: 5,
    page: 1,
  });

  const colors = ["red", "green", "blue"];
  const salePercent =
    product?.currentSaleEventProduct && product?.currentSaleEventProduct
      ? Math.floor(
          100 -
            (product?.currentSaleEventProduct.sellingPrice /
              product?.currentSaleEventProduct.price) *
              100,
        )
      : 0;
  return (
    <>
      <Box sx={{ display: { sm: "none", xs: "block" } }}>
        <Typography variant="h6" textTransform="uppercase">
          {product?.name}
        </Typography>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography color="primary" variant="h6">
                {getProductReviews?.paginate?.total > 0
                  ? Number(product.ratingAvg).toFixed(1)
                  : "5.0"}
                /
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Typography color="primary" variant="caption">
                  5.0
                </Typography>
              </Box>

              <Typography color="grey.400" variant="overline" sx={{ ml: 1 }}>
                {`(${commentCount} ${pageContent.customerReviews})`}
              </Typography>
            </Box>

            {!product?.currentSaleEvent && !product?.currentSaleEventProduct && (
              <Box>
                <Typography variant="h6" mt={1}>
                  {toCurrency(product?.sellingPrice || 0)}
                </Typography>
              </Box>
            )}
          </Box>
          {product?.currentSaleEvent && product?.currentSaleEventProduct && (
            <Box sx={{ display: { sm: "none", xs: "block" } }}>
              <Box
                px={2}
                py={1}
                sx={{
                  backgroundImage: `url(${FlashSaleImg.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  borderRadius: "2px",
                }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="h5"
                    color="common.white"
                    fontWeight="fontWeightMedium"
                  >
                    {toCurrency(
                      product?.currentSaleEventProduct.sellingPrice || 0,
                    )}
                  </Typography>
                  <Box display="flex">
                    <Typography
                      variant="h6"
                      sx={{ textDecoration: "line-through" }}
                      fontWeight="fontWeightMedium"
                    >
                      {toCurrency(product?.currentSaleEventProduct.price || 0)}
                    </Typography>
                    <Typography
                      ml="6px"
                      variant="h6"
                      color="common.white"
                      fontWeight="fontWeightMedium"
                    >
                      {salePercent < 0 ? 0 : ` -${salePercent}%`}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <Typography
                    variant="overline"
                    color="common.white"
                    textTransform="none"
                    lineHeight={1.4}
                  >
                    {pageContent.endAfter}
                  </Typography>
                  <LcRealTimeSale
                    productDetailRefetch={productDetailRefetch}
                    saleTimeStart={product?.currentSaleEvent.startAt}
                    saleTimeEnd={product?.currentSaleEvent.endAt}
                  />
                  <Box display="flex">
                    {/* <Typography
                      variant="overline"
                      color="common.white"
                      textTransform="none"
                      lineHeight={1.4}
                    >
                      {pageContent.sold}
                    </Typography> */}
                    {/* <Typography
                      variant="overline"
                      color="common.white"
                      fontWeight="fontWeightBold"
                      textTransform="none"
                      ml="4px"
                      lineHeight={1.4}
                    >
                      {`127
                        ${pageContent.products}`}
                    </Typography> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Grid container mt={2.5} width="100%">
        <Grid item sm={6} xs={12} className="GoOO">
          <Grid container>
            <Grid
              item
              sm={2}
              xs={12}
              sx={{
                overflowY: "auto",
                height: { sm: "464px", xs: "auto" },
                display: { sm: "block", xs: "flex" },
                justifyContent: "flex-start",
              }}
              order={{ sm: 1, xs: 2 }}
            >
              {product?.images.map((image, i) => {
                return (
                  <Box
                    key={i}
                    mt={{ sm: 0, xs: 2 }}
                    mr={{ sm: 0, xs: 2 }}
                    mb={2}
                    sx={{
                      border: `2px solid ${
                        i === activeSlideIndex ? "grey.400" : "transparent"
                      }`,
                      cursor: i === activeSlideIndex ? "default" : "pointer",
                      pointerEvents: i === activeSlideIndex ? "none" : "all",
                      opacity: i === activeSlideIndex ? 0.7 : 1,
                    }}
                    onClick={() => sliderRef.current.slickGoTo(i)}
                  >
                    <Box
                      width={isPC ? 64 : 74}
                      height={isPC ? 64 : 74}
                      position="relative"
                    >
                      <ImageWithFallback
                        src={
                          image.small.length === 0
                            ? FallbackImage600x300
                            : image.small
                        }
                        width={isPC ? 64 : 74}
                        height={isPC ? 64 : 74}
                        alt={product.name}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Grid>
            <Grid
              order={{ sm: 2, xs: 1 }}
              item
              sm={10}
              xs={12}
              sx={{
                height: "auto",
                pr: { sm: "16px", xs: 0 },
                ml: { sm: "-16px", xs: 0 },
              }}
              display="flex"
            >
              <StyledSlider
                ref={sliderRef}
                afterChange={(index) => setActiveSlideIndex(index)}
                {...settings}
              >
                {product?.images.map((image, i) => {
                  return (
                    <StyledSliderItem key={i}>
                      <ImageWithFallback
                        src={
                          image.large.length === 0
                            ? FallbackImage600x300
                            : image.large
                        }
                        layout="fill"
                        alt={product.name}
                      />
                    </StyledSliderItem>
                  );
                })}
              </StyledSlider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box>
            <Typography
              variant="h5"
              textTransform="uppercase"
              sx={{ display: { sm: "block", xs: "none" } }}
            >
              {product?.name}
            </Typography>
            <Box sx={{ display: { sm: "block", xs: "none" } }}>
              {product?.currentSaleEvent && product?.currentSaleEventProduct ? (
                <Box
                  px={2}
                  py={1}
                  sx={{
                    backgroundImage: `url(${FlashSaleImg.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    borderRadius: "2px",
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      variant="h5"
                      color="common.white"
                      fontWeight="fontWeightMedium"
                    >
                      {toCurrency(
                        product?.currentSaleEventProduct.sellingPrice || 0,
                      )}
                    </Typography>
                    <Box display="flex">
                      <Typography
                        variant="h6"
                        sx={{ textDecoration: "line-through" }}
                        fontWeight="fontWeightMedium"
                      >
                        {toCurrency(
                          product?.currentSaleEventProduct.price || 0,
                        )}
                      </Typography>
                      <Typography
                        ml="6px"
                        variant="h6"
                        color="common.white"
                        fontWeight="fontWeightMedium"
                      >
                        {salePercent < 0 ? 0 : ` -${salePercent}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                  >
                    <Typography
                      variant="overline"
                      color="common.white"
                      textTransform="none"
                      lineHeight={1.4}
                    >
                      {pageContent.endAfter}
                    </Typography>
                    <LcRealTimeSale
                      productDetailRefetch={productDetailRefetch}
                      saleTimeStart={product?.currentSaleEvent.startAt}
                      saleTimeEnd={product?.currentSaleEvent.endAt}
                    />
                    <Box display="flex">
                      {/* <Typography
                        variant="overline"
                        color="common.white"
                        textTransform="none"
                        lineHeight={1.4}
                      >
                        {pageContent.sold}
                      </Typography> */}

                      {/* <Typography
                        variant="overline"
                        color="common.white"
                        fontWeight="fontWeightBold"
                        textTransform="none"
                        ml="4px"
                        lineHeight={1.4}
                      >
                        {`127
                        ${pageContent.products}`}
                      </Typography> */}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="title"
                    mt={1}
                    sx={{ display: { sm: "block", xs: "none" } }}
                  >
                    {toCurrency(product?.sellingPrice || 0)}
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="body2" mt={2}>
              {product?.shortDescription}
            </Typography>
            <Box mt={3}>
              <Box display="flex" alignItems="center">
                {/* <Typography variant="subtitle2" textTransform="uppercase">
                Loại
              </Typography>
              <Box ml={8}>
                <LcSizeButton />
              </Box> */}
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                {/* <Typography variant="subtitle2" textTransform="uppercase">
                  Màu sắc
                </Typography>
                <Box ml={4}>
                  <LcRadioButton colors={colors}></LcRadioButton>
                </Box> */}
              </Box>
            </Box>
            <Box
              mt={2}
              sx={{ display: { xs: "block", sm: "flex" } }}
              alignItems="center"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <LcInputCount
                  min={1}
                  max={maxAddQuantity}
                  value={quantity}
                  onChange={(quantity) => setQuantity(quantity)}
                />
                <Box
                  sx={{
                    display: { sm: "none", xs: "flex" },
                    alignItems: "center",
                  }}
                >
                  {isLogin && (
                    <LcIconButton
                      iconName={
                        alreadyWishlist ? "favorite" : "favorite_outline"
                      }
                      active={alreadyWishlist}
                      onClick={handleWishlistActions}
                      isLoading={isAddingWishlist}
                    />
                  )}

                  <Box ml={1}>
                    <FacebookShareButton
                      url={`${config.env.shareDomain}${router.asPath}`}
                    >
                      <IconButton
                        sx={{ backgroundColor: "grey.50", p: "15px" }}
                      >
                        <ShareIcon
                          sx={{ fontSize: theme.typography.subtitle2 }}
                        />
                      </IconButton>
                    </FacebookShareButton>
                  </Box>
                </Box>
              </Box>

              <>
                {isOutOfStock ? (
                  isLogin ? (
                    <LcLoadingButton
                      isLoading={isAdding}
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        height: "48px",
                        maxWidth: { sm: "256px", xs: "100%" },
                        ml: { sm: "16px", xs: 0 },
                        mt: { sm: 0, xs: "18px" },
                      }}
                      onClick={handleWishlistActions}
                    >
                      {alreadyWishlist
                        ? pageContent.removeFromFavorite
                        : pageContent.addToFavorite}
                    </LcLoadingButton>
                  ) : (
                    <Box
                      height={48}
                      bgcolor="action.disabled"
                      width={1}
                      maxWidth={{ sm: 256, xs: 1 }}
                      ml={{ sm: 2, xs: 0 }}
                      mt={{ sm: 0, xs: 2 }}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      textTransform="uppercase"
                    >
                      <Typography variant="body2" color="common.white">
                        {pageContent.outOfStock}
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Stack
                    direction={{ sm: "row", xs: "column" }}
                    spacing={2}
                    sx={{
                      ml: { xs: 0, sm: 2 },
                      mt: { xs: 2, sm: 0 },
                      width: 1,
                    }}
                  >
                    <LcLoadingButton
                      isLoading={isAdding}
                      disabled={isAdding || isBuying}
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={handleAddToCart}
                    >
                      {pageContent.addToCart}
                    </LcLoadingButton>
                    <LcLoadingButton
                      isLoading={isBuying}
                      disabled={isAdding || isBuying}
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleBuyNow}
                    >
                      {pageContent.buyNow}
                    </LcLoadingButton>
                  </Stack>
                )}
              </>
            </Box>
            <Box
              mt={3.25}
              display="flex"
              sx={{ display: { sm: "flex", xs: "none" } }}
              alignItems="center"
            >
              {isLogin && (
                <LcLoadingButton
                  isLoading={isAddingWishlist}
                  variant="text"
                  size="small"
                  color={alreadyWishlist ? "primary" : "inherit"}
                  startIcon={
                    alreadyWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />
                  }
                  onClick={handleWishlistActions}
                >
                  {alreadyWishlist
                    ? pageContent.removeFromFavorite
                    : pageContent.addToFavorite}
                </LcLoadingButton>
              )}
              <Box sx={{ ml: `${isLogin ? "50px" : "0px"}` }}>
                <FacebookShareButton
                  url={`${config.env.shareDomain}${router.asPath}`}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    size="small"
                    startIcon={
                      <ShareIcon
                        sx={{
                          "&.MuiSvgIcon-root": {
                            fontSize: theme.typography.overline,
                          },
                        }}
                      />
                    }
                  >
                    <Typography variant="subtitle2">
                      {pageContent.share}
                    </Typography>
                  </Button>
                </FacebookShareButton>
              </Box>
            </Box>
            <Box mt={2.5}>
              <Box display="flex">
                <Box flex={1}>
                  <Box display="flex">
                    <Typography
                      variant="subtitle2"
                      color={`${theme.palette.grey.A700}`}
                    >
                      SKU:
                    </Typography>
                    <Typography variant="subtitle2" ml="4px">
                      {product?.sku}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Typography
                      variant="subtitle2"
                      color={`${theme.palette.grey.A700}`}
                      textTransform="uppercase"
                    >
                      {pageContent.category}
                    </Typography>
                    {product?.taxons.length === 0 ? (
                      <Box></Box>
                    ) : (
                      <Box display="flex" flexWrap="wrap" flex={7} pl={0.5}>
                        {product?.taxons.map((data, index) => {
                          return (
                            <Link
                              href={`/category/${data.slug}`}
                              underline="hover"
                              color="inherit"
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(`/category/${data.slug}`);
                              }}
                            >
                              <Typography key={index} variant="subtitle2">
                                {data.name +
                                  (index !== product?.taxons.length - 1
                                    ? ", "
                                    : "")}
                              </Typography>
                            </Link>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                  <Box display="flex">
                    <Typography
                      variant="subtitle2"
                      color={`${theme.palette.grey.A700}`}
                      textTransform="uppercase"
                    >
                      {pageContent.keyWord}
                    </Typography>
                    <Typography variant="subtitle2" ml="4px"></Typography>
                  </Box>
                </Box>
                {isPC && (
                  <Box flex={1}>
                    <Box display="flex" height="64px">
                      <Box position="relative">
                        <Image src={QRImage} height={64} width={64} alt="QR" />
                      </Box>
                      <Box ml="11px">
                        <Typography variant="subtitle2">
                          {formatMessage({
                            id: "productDetail.download",
                          })}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "fontWeightBold" }}
                        >
                          HiddenTag
                        </Typography>
                        <Typography variant="subtitle2">
                          {formatMessage({
                            id: "productDetail.checkScam",
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export const LcProductDetailInfo = memo(LcProductDetailInfoComponent, isEqual);
