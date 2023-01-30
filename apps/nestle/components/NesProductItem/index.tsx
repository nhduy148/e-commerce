import { AuthenticationContext } from "@hera/contexts";
import { IProduct, useAddWishlist, useRemoveWishlist } from "@hera/data";
import { formatDay, toCurrency } from "@hera/utils";
import { Box, Card, Rating, styled, Typography, useTheme } from "@mui/material";
import { NesIconButton, NesProductImage } from "@nestle/components";
import { WRAPPER_PRODUCT_ITEM_SPACING } from "@nestle/constants";
import { useBreakPoint } from "@nestle/hooks";
import { SaleIcon } from "@nestle/static/images";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSnackbar, VariantType } from "notistack";
import { FC, memo, useContext, useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const classNames = {
  cardImage: "lc-card-image",
  cardActions: "lc-card-actions",
  cardActionsInner: "lc-card-actions-inner",
  disableActions: "lc-card-actions-disable",
  favoriteIcon: "lc-favorite-icon-button",
  productContent: "lc-card-content",
};

const StyledCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  background-color: transparent;
  transition: all 300ms;
  padding: ${WRAPPER_PRODUCT_ITEM_SPACING}px;
  .${classNames.cardActions} {
    padding: 0;
    transition: all 300ms;
  }
  .${classNames.productContent} {
    transition: all 300ms;
  }
  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 16px ${({ theme }) => theme.palette.action.focus};
    background-color: ${({ theme }) =>
      theme.palette.custom.secondaryBackground};
  }

  .${classNames.cardActions} {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .${classNames.favoriteIcon} {
    background-color: ${({ theme }) => theme.palette.action.disabledBackground};
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 1rem;
    width: 36px;
    height: 36px;
  }
`;

const StyledProductName = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 44px;
`;

const StyledBrandName = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  display: block;
`;

const StyledOriginalPrice = styled(Typography)`
  text-decoration: line-through;
  margin-left: 6px;
  line-height: 1;
`;

const StyledCardWrapper = styled(Box)`
  cursor: pointer;
`;

interface INesProductItemProps {
  product: IProduct;
}

const NesProductItemComponent: FC<INesProductItemProps> = ({ product }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isAddingWishlist, setAddingWishlist] = useState<boolean>(false);
  const [alreadyWishlist, setWishlist] = useState<boolean>(
    Boolean(product?.alreadyWishlist),
  );
  const isPC = useBreakPoint("sm");
  const { mutateAsync: removeWishlistAsync } = useRemoveWishlist();
  const { mutateAsync: addWishlistAsync } = useAddWishlist();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage, locale } = useIntl();
  const { isLogin } = useContext(AuthenticationContext);

  useEffect(() => {
    setWishlist(Boolean(product?.alreadyWishlist));
  }, [product]);

  const haveDiscount: boolean = product.sellingPrice < product.maxRetailPrice;
  const isOutOfStock: boolean = product.inStock <= 0;
  const hasSaleEvent: boolean = Boolean(
    product?.currentSaleEvent && product?.currentSaleEventProduct,
  );
  const href = "/products/" + product.slug;
  const goToDetail = (e) => {
    e.preventDefault();
    router.push(href);
  };

  const translate = {
    supperSale: formatMessage({ id: "productsPage.SupperSale" }),
    addToCartSuccess: formatMessage({ id: "shoppingCart.addToCartSuccess" }),
    addWishlistSuccess: formatMessage({ id: "wishlist.addSuccess" }),
    addWishlistFailure: formatMessage({ id: "wishlist.addFailure" }),
    removeWishlistSuccess: formatMessage({ id: "wishlist.removeSuccess" }),
    removeWishlistFailure: formatMessage({ id: "wishlist.removeFailure" }),
    outOfStock: formatMessage({ id: "common.outOfStock" }),
  };

  const handleWishlistActions = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isAddingWishlist) {
      return;
    }
    let message = "";
    let variant: VariantType = "success";
    const id = product.id;
    if (!id) return;
    setAddingWishlist(true);
    try {
      if (alreadyWishlist) {
        await removeWishlistAsync({ id });
        message = translate.removeWishlistSuccess;
      } else {
        await addWishlistAsync({ id });
        message = translate.addWishlistSuccess;
      }
      setWishlist((current) => !current);
      variant = "success";
    } catch (error) {
      if (alreadyWishlist) {
        message = translate.removeWishlistFailure;
      } else {
        message = translate.addWishlistFailure;
      }
      variant = "error";
    } finally {
      enqueueSnackbar(message, { variant });
      setAddingWishlist(false);
    }
  };

  const totalRating = Object.entries(product?.ratingSummary || {}).reduce(
    (acc, [k, v]) => {
      return acc + v;
    },
    0,
  );

  return (
    <StyledCardWrapper
      component="a"
      sx={{ textDecoration: "none" }}
      // @ts-ignore
      href={href}
      onClick={goToDetail}
    >
      <StyledCard className={classNames.cardActions} elevation={0}>
        <NesProductImage
          product={product}
          WrapperProps={{
            className: `${classNames.cardImage} ${
              isOutOfStock ? classNames.disableActions : ""
            }`,
            sx: { mb: 1 },
          }}
        >
          <>
            <Box
              position="absolute"
              top={isPC || isLogin ? 0 : "unset"}
              bottom={isPC || isLogin ? "unset" : 0}
              left={0}
              right={0}
              display="flex"
              alignItems={isPC || isLogin ? "flex-start" : "stretch"}
              flexDirection="column"
            >
              {hasSaleEvent && (
                <Box zIndex={2}>
                  <Box display="flex" alignItems="center">
                    <Image
                      src={SaleIcon.src}
                      height={27}
                      width={27}
                      alt="Login"
                    />
                    <Box
                      height="auto"
                      ml="-10px"
                      pl="10px"
                      pr="8px"
                      display="flex"
                      alignItems="center"
                      sx={{
                        height: "16px",
                        borderRadius: "2px",
                        backgroundImage: `linear-gradient(to right, ${theme.palette.success["800"]} , ${theme.palette.success["700"]})`,
                      }}
                    >
                      <Typography
                        variant="overline"
                        lineHeight="normal"
                        textTransform="none"
                        color="common.white"
                      >
                        {`${translate.supperSale} ${formatDay(
                          product?.currentSaleEvent?.endAt,
                          locale,
                        )}`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {isOutOfStock && (
                <Box
                  px={isPC ? 1 : 0.5}
                  py={isPC ? 0.5 : 0.25}
                  bgcolor="action.disabled"
                  color="common.white"
                  textAlign="center"
                  zIndex={2}
                >
                  <Typography variant="overline" textTransform="none">
                    {translate.outOfStock}
                  </Typography>
                </Box>
              )}
            </Box>
            {isLogin && (
              <Box position="absolute" top={4} right={4} zIndex={2}>
                <NesIconButton
                  iconName={alreadyWishlist ? "favorite" : "favorite_outline"}
                  color={alreadyWishlist ? "error" : "primary"}
                  onClick={handleWishlistActions}
                  isLoading={isAddingWishlist}
                />
              </Box>
            )}
          </>
        </NesProductImage>
        <Box className={classNames.productContent}>
          {product?.brand?.name ? (
            <StyledBrandName
              variant="body2"
              title={product.brand.name}
              color="primary.main"
            >
              {product.brand.name}
            </StyledBrandName>
          ) : (
            <Box height={20} />
          )}

          <StyledProductName
            variant="subtitle1"
            title={product.name}
            sx={{ mb: 0.5 }}
          >
            {product.name}
          </StyledProductName>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            mb={0.75}
          >
            <Rating readOnly value={+product?.ratingAvg} size="small" />
            {/* <Box height={16} borderRight="1px solid" color="grey.500" pr={0.75}>
              <Rating readOnly value={totalRating} size="small" />
            </Box>

            <Typography
              variant="overline"
              color="grey.500"
              sx={{ ml: 0.75, lineHeight: 1 }}
            >
              {__({ defaultMessage: "Đã bán 300" })}
            </Typography> */}
          </Box>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1">
              {toCurrency(product.sellingPrice)}
            </Typography>
            {haveDiscount && (
              <StyledOriginalPrice variant="body1" color="grey.500">
                {toCurrency(product.maxRetailPrice)}
              </StyledOriginalPrice>
            )}
          </Box>
        </Box>
      </StyledCard>
    </StyledCardWrapper>
  );
};

export const NesProductItem = memo(NesProductItemComponent, isEqual);
