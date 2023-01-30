import { GSPProductImage } from "@gsp/components";
import { WRAPPER_PRODUCT_ITEM_SPACING } from "@gsp/constants";
import { IProduct, useAddWishlist, useRemoveWishlist } from "@hera/data";
import {
  Box,
  Card,
  lighten,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar, VariantType } from "notistack";
import { FC, memo, useEffect, useState } from "react";
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
      lighten(theme.palette.primary.light, 0.96)};
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

const StyledProductDesc = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 56px;
`;

const StyledCardWrapper = styled(Box)`
  cursor: pointer;
`;

interface IGSPProductItemProps {
  product: IProduct;
}

const GSPProductItemComponent: FC<IGSPProductItemProps> = ({ product }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isAddingWishlist, setAddingWishlist] = useState<boolean>(false);
  const [alreadyWishlist, setWishlist] = useState<boolean>(
    Boolean(product?.alreadyWishlist),
  );
  const { mutateAsync: removeWishlistAsync } = useRemoveWishlist();
  const { mutateAsync: addWishlistAsync } = useAddWishlist();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage, locale } = useIntl();

  useEffect(() => {
    setWishlist(Boolean(product?.alreadyWishlist));
  }, [product]);

  const href = "/products/" + product.slug;
  const goToDetail = (e) => {
    e.preventDefault();
    router.push(href);
  };

  const translate = {
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

  return (
    <StyledCardWrapper
      component="a"
      sx={{ textDecoration: "none" }}
      // @ts-ignore
      href={href}
      onClick={goToDetail}
    >
      <StyledCard className={classNames.cardActions} elevation={0}>
        <GSPProductImage
          product={product}
          WrapperProps={{
            className: `${classNames.cardImage}`,
            sx: { mb: 1, backgroundColor: theme.palette.background.paper },
          }}
        />
        {/* <Box position="absolute" top={4} right={4} zIndex={2}>
            <GSPIconButton
              iconName={alreadyWishlist ? "favorite" : "favorite_outline"}
              color={alreadyWishlist ? "error" : "primary"}
              onClick={handleWishlistActions}
              isLoading={isAddingWishlist}
            />
          </Box> */}
        {/* </GSPProductImage> */}
        <Box className={classNames.productContent}>
          <StyledProductName
            variant="subtitle1"
            title={product?.name}
            sx={{ mb: 0.5 }}
          >
            {product?.name}
          </StyledProductName>
          <StyledProductDesc
            variant="caption"
            title={product?.description}
            dangerouslySetInnerHTML={{ __html: product?.description }}
          />
        </Box>
      </StyledCard>
    </StyledCardWrapper>
  );
};

export const GSPProductItem = memo(GSPProductItemComponent, isEqual);
