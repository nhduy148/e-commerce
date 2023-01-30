import * as config from "@hera/config";

import {
  IProductDetail,
  useAddWishlist,
  useGetProductReviews,
  useRemoveWishlist,
} from "@hera/data";
import { Image } from "@hera/ui";

import { AuthenticationContext } from "@hera/contexts";
import { usePrevious } from "@hera/hooks";
import { toCurrency } from "@hera/utils";
import {
  AddShoppingCart as AddShoppingCartIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
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
import { NesIconButton, NesLoadingButton } from "@nestle/components";
import { useAddToCart, useBreakPoint } from "@nestle/hooks";
import { FlashSaleImg } from "@nestle/static/images";
import { useRouter } from "next/router";
import { useSnackbar, VariantType } from "notistack";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { FacebookShareButton } from "react-share";
import Slider from "react-slick";
import { NesInputCount, NesRealTimeSale } from "./index";

const settings = {
  arrows: false,
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const StyledSliderItem = styled(Box)`
  width: 100%;
  height: 100%;

  span {
    width: 100% !important;
    height: 100% !important;

    display: block !important;
  }
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  display: flex;

  span {
    border-radius: 12px;
  }

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

const StyledSubSlider = styled(Slider)`
  .slick-slide {
    max-width: 64px;
    margin-right: 12px;
  }
`;
interface Props {
  productDetail: IProductDetail;
  productDetailRefetch: () => void;
}

const NesProductDetailInfoComponent = ({
  productDetail: product,
  productDetailRefetch,
}: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { isLogin: isLoggedIn } = useContext(AuthenticationContext);

  const [alreadyWishlist, setWishlist] = useState<boolean>(
    Boolean(product?.alreadyWishlist),
  );
  const [isAdding, setAdding] = useState<boolean>(false);
  const [isBuying, setBuying] = useState<boolean>(false);
  const [isAddingWishlist, setAddingWishlist] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const isOutOfStock: boolean = product.inStock <= 0;
  const previousProductId = usePrevious<number | null>(product?.id || null);

  useEffect(() => {
    setWishlist(Boolean(product?.alreadyWishlist));
  }, [product]);

  useEffect(() => {
    if (previousProductId !== product?.id) {
      setQuantity(1);
    }
  }, [previousProductId, product?.id]);

  const [sliderNav1, setSliderNav1] = useState();
  const [sliderNav2, setSliderNav2] = useState();

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
    loginToAddWishlist: formatMessage({ id: "wishlist.loginToAddWishlist" }),
    buyNow: formatMessage({ id: "common.buyNow" }),
  };

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
      {
        quantity,
        productId: product.id,
      },
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
        productId: product.id,
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
      variant = "success";
    } catch (error) {
      if (alreadyWishlist) {
        message = pageContent.removeWishlistFailure;
      }
      if (!isLoggedIn) {
        message = pageContent.loginToAddWishlist;
      } else {
        message = pageContent.addWishlistFailure;
      }
      variant = "error";
    } finally {
      enqueueSnackbar(message, { variant });
      setAddingWishlist(false);
    }
  };
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
  //@ts-ignore
  const { data: getProductReviews } = useGetProductReviews({
    productId: product?.id,
    size: 5,
    page: 1,
  });
  return (
    <>
      <Box sx={{ display: { sm: "none", xs: "block" } }}>
        <Typography variant="h6">{product?.name}</Typography>
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
                {product.ratingAvg || 0}/
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Typography color="primary" variant="caption">
                  5.0
                </Typography>
              </Box>

              <Typography color="grey.400" variant="overline" sx={{ ml: 1 }}>
                {`(${getProductReviews?.paginate?.total} ${pageContent.customerReviews})`}
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
                  <NesRealTimeSale
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
      <Grid container mt={2.5} spacing={3}>
        <Grid item sm={5} xs={12}>
          <StyledSlider
            asNavFor={sliderNav2}
            // @ts-ignore
            ref={(slider1) => setSliderNav1(slider1)}
            {...settings}
          >
            {product?.images.map((image, i) => (
              <StyledSliderItem
                key={i}
                sx={{
                  "& span": {
                    borderRadius: "12px",
                  },
                }}
              >
                <Image
                  src={image.large}
                  width={isPC ? 465 : 347}
                  height={isPC ? 465 : 347}
                  alt={product.name}
                />
              </StyledSliderItem>
            ))}
          </StyledSlider>

          <Box mt={1.5}>
            <StyledSubSlider
              sx={{
                ".slick-slide": {
                  maxWidth: `${
                    product?.images?.length >= 4
                      ? "unset"
                      : isPC
                      ? "64px"
                      : "74px"
                  }`,
                  marginRight: `${
                    product?.images?.length >= 4 ? "0px" : "12px"
                  }`,
                },
              }}
              {...{
                slidesToShow:
                  product?.images?.length >= 4
                    ? 4
                    : product?.images?.length || 1,
                swipeToSlide: true,
                focusOnSelect: true,
                arrows: false,
              }}
              asNavFor={sliderNav1}
              // @ts-ignore
              ref={(slider2) => setSliderNav2(slider2)}
            >
              {product?.images.map((image, i) => (
                <Box
                  key={i}
                  mr={1.5}
                  sx={{
                    "& span": {
                      borderRadius: "6px",
                    },
                  }}
                >
                  <Image
                    src={image.small}
                    width={isPC ? "64px" : "74px"}
                    height={isPC ? "64px" : "74px"}
                    alt={product.name}
                  />
                </Box>
              ))}
            </StyledSubSlider>
          </Box>

          {/* <Box
            sx={{
              overflowX: "auto",
              height: "auto",
              display: "flex",
              justifyContent: "flex-start",
              mt: 1.5,
            }}
            order={{ sm: 1, xs: 2 }}
          >
            {product?.images.map((e, i) => {
              return (
                <Box
                  key={i}
                  mr={2}
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
                    position="relative"
                    width={isPC ? 64 : 74}
                    height={isPC ? 64 : 74}
                  >
                    <Image
                      src={e.small}
                      width={isPC ? 64 : 74}
                      height={isPC ? 64 : 74}
                      alt=""
                    />
                  </Box>
                </Box>
              );
            })}
          </Box> */}
        </Grid>
        <Grid item sm={7} xs={12}>
          <Box>
            <Typography
              variant="h5"
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
                    <NesRealTimeSale
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
                    variant="h5"
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
                <NesSizeButton />
              </Box> */}
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                {/* <Typography variant="subtitle2" textTransform="uppercase">
                  Màu sắc
                </Typography>
                <Box ml={4}>
                  <NesRadioButton colors={colors}></NesRadioButton>
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
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: { sm: "none", xs: "flex" },
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <NesInputCount
                    min={1}
                    max={product?.maxInCart || 99}
                    value={quantity}
                    onChange={(quantity) => setQuantity(quantity)}
                  />

                  <Box
                    sx={{
                      display: { xs: "flex" },
                      alignItems: "center",
                    }}
                  >
                    <NesIconButton
                      iconName={
                        alreadyWishlist ? "favorite" : "favorite_outline"
                      }
                      active={alreadyWishlist}
                      onClick={handleWishlistActions}
                      isLoading={isAddingWishlist}
                    />

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
              </Box>

              <>
                {isOutOfStock ? (
                  <Box
                    height={48}
                    bgcolor="action.disabled"
                    width={1}
                    maxWidth={{ sm: 256, xs: 1 }}
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
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      borderRadius: 1,
                      p: { sm: 1, xs: 0 },
                      pt: 1,
                      width: 1,
                      backgroundColor: {
                        sm: theme.palette.grey[100],
                        xs: "none",
                      },
                    }}
                  >
                    <NesInputCount
                      sx={{
                        display: { sm: "flex", xs: "none" },
                      }}
                      min={1}
                      max={product?.maxInCart || 99}
                      value={quantity}
                      onChange={(quantity) => setQuantity(quantity)}
                    />
                    <Stack
                      direction={{ sm: "row", xs: "column" }}
                      spacing={{ xs: 1, sm: 2 }}
                      sx={{
                        ml: { xs: 0, sm: 1 },
                        mt: { xs: 1, sm: 0 },
                        width: 1,
                      }}
                    >
                      <NesLoadingButton
                        startIcon={<AddShoppingCartIcon />}
                        isLoading={isAdding}
                        variant="outlined"
                        size="large"
                        fullWidth
                        onClick={handleAddToCart}
                      >
                        {pageContent.addToCart}
                      </NesLoadingButton>
                      <NesLoadingButton
                        isLoading={isBuying}
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleBuyNow}
                      >
                        {pageContent.buyNow}
                      </NesLoadingButton>
                    </Stack>
                  </Box>
                )}
              </>
            </Box>
            <Box
              mt={3.25}
              display="flex"
              sx={{ display: { sm: "flex", xs: "none" } }}
              alignItems="center"
            >
              <NesLoadingButton
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
              </NesLoadingButton>
              <Box sx={{ ml: "12px" }}>
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
                    {pageContent.share}
                  </Button>
                </FacebookShareButton>
              </Box>
            </Box>
            <Box mt={2.5}>
              <Box display="flex">
                <Box flex={1}>
                  <Box display="flex">
                    <Typography
                      variant="body2"
                      color={`${theme.palette.grey.A700}`}
                    >
                      SKU:
                    </Typography>
                    <Typography variant="body2" ml="4px">
                      {product?.sku}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Typography
                      variant="body2"
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
                  <Box display="block">
                    <Typography
                      variant="body2"
                      color={`${theme.palette.grey.A700}`}
                      textTransform="uppercase"
                    >
                      {pageContent.keyWord}
                    </Typography>
                    <Typography variant="subtitle2" ml="4px"></Typography>
                    <Box mt={2}>
                      <Box display="flex" alignItems="center">
                        <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
                        <Typography ml={0.5} variant="body2">
                          Đổi trả trong vòng 14 ngày
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
                        <Typography ml={0.5} variant="body2">
                          Hàng chính hãng 100%
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
                        <Typography ml={0.5} variant="body2">
                          Freeship
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {/* {isPC && (
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
                )} */}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export const NesProductDetailInfo = memo(
  NesProductDetailInfoComponent,
  isEqual,
);
