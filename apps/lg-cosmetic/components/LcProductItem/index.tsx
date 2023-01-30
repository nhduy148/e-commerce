import { AuthenticationContext } from "@hera/contexts";
import {
  GET_JUST_FOR_YOU,
  IProduct,
  useAddWishlist,
  useRemoveWishlist,
  USER_WISHLIST,
} from "@hera/data";
import { formatDay, toCurrency } from "@hera/utils";
import { LcIconButton, LcProductImage } from "@lc/components";
import { useAddToCart, useBreakPoint } from "@lc/hooks";
import { gtmEvent } from "@lc/libs";
import { SaleIcon } from "@lc/static/images";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  styled,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSnackbar, VariantType } from "notistack";
import { memo, useContext, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";
import { LcAddToCartButton } from "./LcAddToCartButton";

const classNames = {
  cardImage: "lc-card-image",
  cardActions: "lc-card-actions",
  cardActionsInner: "lc-card-actions-inner",
  disableActions: "lc-card-actions-disable",
  favoriteIcon: "lc-favorite-icon-button",
};

const StyledCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 350px;
  border-top-width: 4px;
  border-top-style: solid;
  border-top-color: ${({ theme }) => theme.palette.primary.dark};

  .${classNames.cardActions} {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  ${`.${classNames.cardImage}`} {
    ::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: ${({ theme }) => theme.palette.common.white};
      opacity: 0;
    }
    &.${classNames.disableActions} {
      ::before,
      :hover::before {
        z-index: -1;
        opacity: 0;
      }
    }
    :hover {
      ${(props) => props.theme.breakpoints.up("sm")} {
        ::before {
          opacity: 0.7;
          z-index: 1;
        }
        .${classNames.cardActions} {
          opacity: 1;
        }
        .${classNames.cardActionsInner} {
          transform: translateY(0);
        }
      }
    }
  }

  .${classNames.favoriteIcon} {
    background-color: ${({ theme }) => theme.palette.action.disabledBackground};
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 1rem;
    width: 36px;
    height: 36px;
  }
`;

const StyledCardActions = styled(CardActions)(
  ({ theme }: { theme: Theme }) => `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    z-index: 2;
    transition:
      ${theme.transitions.duration.short}ms
      ${theme.transitions.easing.easeInOut};

    .${classNames.cardActionsInner} {
      transform: translateY(20px);
      transition:
        ${theme.transitions.duration.short}ms
        ${theme.transitions.easing.easeInOut} !important;
    }
  `,
);

const StyledProductName = styled(Typography)`
  text-transform: uppercase;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
`;

const StyledBrandName = styled(Typography)(
  ({ theme }: { theme: Theme }) => `
  padding-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  text-align: center;
  margin-bottom: 6px;
  color: ${theme.palette.primary.dark};
  display: block;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 1px;
    background-color: ${theme.palette.primary.dark}
  }
`,
);

const StyledOriginalPrice = styled(Typography)`
  text-decoration: line-through;
  margin-left: 12px;
  line-height: 1;
  margin-top: 2px;
`;

const StyledCardWrapper = styled(Box)`
  cursor: pointer;
`;

interface ILcProductItemProps {
  product: IProduct;
}

const LcProductItemComponent = ({ product }: ILcProductItemProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [isAdding, setAdding] = useState<boolean>(false);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [isAddingWishlist, setAddingWishlist] = useState<boolean>(false);
  const [alreadyWishlist, setWishlist] = useState<boolean>(
    Boolean(product?.alreadyWishlist),
  );
  const queryClient = useQueryClient();
  const isPC = useBreakPoint("sm");
  const { mutateAsync: removeWishlistAsync } = useRemoveWishlist();
  const { mutateAsync: addWishlistAsync } = useAddWishlist();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage, locale } = useIntl();
  const { isLogin: isLoggedIn } = useContext(AuthenticationContext);
  const _handleAddToCart = useAddToCart();
  const imageRef = useRef<HTMLElement | null>(null);

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
    gtmEvent("select_item", product);
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

  const handleAddToCart = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    if (isAdding || !isPC) {
      return;
    }
    setAdding(true);
    _handleAddToCart(
      { quantity: 1, product },
      { finallyCallback: () => setAdding(false) },
    );
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
      queryClient.fetchQuery(GET_JUST_FOR_YOU);
      queryClient.fetchQuery([USER_WISHLIST, {}]);
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
  const handleProductImageMouseEnter = (event: any) => {
    setCardWidth(event.currentTarget.clientWidth || 0);
  };

  return (
    <StyledCardWrapper
      component="a"
      sx={{ textDecoration: "none" }}
      // @ts-ignore
      href={href}
      onClick={goToDetail}
    >
      <StyledCard className={classNames.cardActions}>
        <LcProductImage
          product={product}
          WrapperProps={{
            className: `${classNames.cardImage} ${
              isOutOfStock ? classNames.disableActions : ""
            }`,
            onMouseEnter: handleProductImageMouseEnter,
            ref: imageRef,
          }}
        >
          <>
            {isPC && !isOutOfStock && (
              <StyledCardActions className={classNames.cardActions}>
                <Box className={classNames.cardActionsInner}>
                  <LcAddToCartButton
                    isLoading={isAdding}
                    onAddToCart={handleAddToCart}
                    cardWidth={cardWidth}
                  />
                </Box>
              </StyledCardActions>
            )}
            <Box
              position="absolute"
              top={isPC ? 0 : "unset"}
              bottom={isPC ? "unset" : 0}
              left={0}
              right={0}
              display="flex"
              alignItems={isPC ? "flex-start" : "stretch"}
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
            {isLoggedIn && (
              <Box position="absolute" top={0} right={0} zIndex={2}>
                <LcIconButton
                  iconName={alreadyWishlist ? "favorite" : "favorite_outline"}
                  active={alreadyWishlist}
                  classes={classNames.favoriteIcon}
                  onClick={handleWishlistActions}
                  isLoading={isAddingWishlist}
                />
              </Box>
            )}
          </>
        </LcProductImage>
        <CardContent>
          {product?.brand?.name ? (
            <StyledBrandName variant="overline" title={product?.brand?.name}>
              {product?.brand?.name}
            </StyledBrandName>
          ) : (
            <Box height={28} />
          )}
          <Box mb={1.5}>
            <StyledProductName variant="body2" title={product?.name}>
              {product?.name}
            </StyledProductName>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography>{toCurrency(product?.sellingPrice)}</Typography>
            {haveDiscount && (
              <StyledOriginalPrice variant="caption" color="action.disabled">
                {toCurrency(product?.maxRetailPrice)}
              </StyledOriginalPrice>
            )}
          </Box>
        </CardContent>
      </StyledCard>
    </StyledCardWrapper>
  );
};

export const LcProductItem = memo(LcProductItemComponent, isEqual);
