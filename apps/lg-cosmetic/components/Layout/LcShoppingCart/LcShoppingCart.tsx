import {
  IHttpError,
  ILineItem,
  useRefreshCart,
  useRemoveCartItem,
} from "@hera/data";
import { toCurrency } from "@hera/utils";
import { LcConfirmationDialog, LcGiftItem, LcIconButton } from "@lc/components";
import { useAddToCart, useCart } from "@lc/hooks";
import {
  Box,
  Button,
  debounce,
  Divider,
  Drawer,
  DrawerProps,
  ListSubheader,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { partition } from "lodash-es";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FC, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { LcEmptyCart } from "./LcEmptyCart";
import { LcShoppingCartItem } from "./LcShoppingCartItem";

interface ICart extends Omit<DrawerProps, "onClose"> {
  onClose: (e?: any) => void;
}

const StyledRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LcShoppingCart: FC<ICart> = ({ onClose, open, ...props }) => {
  const { push, asPath } = useRouter();
  const { data: cart, refetch: refetchShoppingCart } = useCart();
  const { refetch: refetchCheckoutCart } = useRefreshCart();
  const { formatMessage } = useIntl();
  const shoppingCartItemAvailable = formatMessage(
    { id: "shoppingCart.totalItems" },
    { total: cart?.itemCount || 0 },
  );
  const [isDeleteDialogOpened, setOpenDeleteDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentDeleteCartItem, setCurrentDeleteCartItem] =
    useState<ILineItem | null>(null);
  const [isItemTexting, setItemTexting] = useState<boolean>(false);

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    debounce(() => {
      setCurrentDeleteCartItem(null);
    }, 100);
  };
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: removeCartItemAsync } = useRemoveCartItem();
  const _handleAddToCart = useAddToCart();

  useEffect(() => {
    if (open) {
      refetchShoppingCart();
    }
  }, [open]);

  const handleTextingQuantity = () => {
    setItemTexting(true);
  };

  const handleQuantityChange = async (
    lineItem: ILineItem,
    quantity: number,
    successCallback?: (data?: any) => void,
    errorCallback?: (error?: IHttpError) => void,
    finallyCallback?: () => void,
  ) => {
    _handleAddToCart(
      {
        quantity,
        product: lineItem?.product,
      },
      {
        successCallback: (data) => {
          if (typeof successCallback === "function") {
            successCallback(data);
          }
        },
        errorCallback: (error) => {
          if (typeof errorCallback === "function") {
            errorCallback(error);
          }
        },
        finallyCallback: () => {
          if (typeof finallyCallback === "function") {
            finallyCallback();
          }
          setItemTexting(false);
        },
      },
      true,
    );
  };

  const handleRemoveCartItem = (lineItem: ILineItem) => {
    setCurrentDeleteCartItem(lineItem);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteCartItem?.id) {
      handleCancelDelete();
      return;
    }
    setIsDeleting(true);
    try {
      await removeCartItemAsync({ id: currentDeleteCartItem.id });
      await refetchShoppingCart();
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: "shoppingCart.removeItemFailed" }), {
        variant: "error",
      });
    } finally {
      handleCancelDelete();
      setIsDeleting(false);
    }
  };

  const handleClose = async (e) => {
    if (isItemTexting) {
      return;
    }
    if (asPath === "/checkout") {
      await refetchCheckoutCart();
    }
    if (typeof onClose === "function") {
      onClose(e);
    }
  };

  const handleCheckout = async (e) => {
    await handleClose(e);
    push("/checkout");
  };

  const [gifts, lineItems] = useMemo(
    () =>
      partition(cart?.lineItems || [], (lineItem) => lineItem.label === "gift"),
    [cart],
  );

  return (
    <Drawer
      disableScrollLock
      {...props}
      anchor="right"
      open={open}
      disableEscapeKeyDown
      onClose={handleClose}
      PaperProps={{
        sx: {
          ...props?.PaperProps?.sx,
          maxWidth: 440,
          width: 1,
          boderTop: "4px solid",
          borderColor: "primary.main",
        },
        ...props?.PaperProps,
      }}
    >
      <Box display="flex" flexDirection="column" height={1}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <LcIconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              left: 22,
            }}
            iconName="close"
          />

          <Typography variant="h5" textTransform="uppercase">
            {formatMessage({ id: "shoppingCart.title" })}
          </Typography>
        </Box>
        <Divider />
        {cart?.lineItems?.length > 0 ? (
          <>
            <Box
              flex={1}
              height={300}
              px={1}
              display="flex"
              flexDirection="column"
              overflow="auto"
            >
              <ListSubheader
                sx={{
                  pt: { lg: 4, md: 3, sm: 2, xs: 1 },
                  pb: { md: 2, xs: 1 },
                  px: 0,
                }}
              >
                <Typography variant="body2" color="grey.A700">
                  <b>{shoppingCartItemAvailable}</b>
                </Typography>
              </ListSubheader>
              <Box flex={1} pb={2}>
                {lineItems
                  .sort((a, b) => a.id - b.id)
                  .map((cartItem, index) => (
                    <>
                      <LcShoppingCartItem
                        cartItem={cartItem}
                        onTextingQuantity={handleTextingQuantity}
                        onQuantityChange={handleQuantityChange}
                        onDeleteItem={handleRemoveCartItem}
                        key={cartItem?.id}
                      />
                      {index < lineItems?.length - 1 && <Divider />}
                    </>
                  ))}
                {gifts
                  .sort((a, b) => a.id - b.id)
                  .map((cartItem, index) => (
                    <>
                      <LcGiftItem cartItem={cartItem} key={cartItem?.id} />
                      {index < gifts.length - 1 && <Divider sx={{ my: 1 }} />}
                    </>
                  ))}
              </Box>
            </Box>
            <Divider />
            <Stack
              py={{ lg: 4, md: 3, xs: 2 }}
              px={{ lg: 3, md: 2, xs: 1.5 }}
              spacing={{ md: 1.5, xs: 1 }}
            >
              <StyledRow>
                <Typography variant="body1" textTransform="uppercase">
                  {formatMessage({ id: "shoppingCart.subTotal" })}
                </Typography>
                <Typography variant="body1">
                  {toCurrency(cart?.subTotal || 0)}
                </Typography>
              </StyledRow>
              <StyledRow>
                <Typography variant="body1" textTransform="uppercase">
                  {formatMessage({ id: "shoppingCart.promoTotal" })}
                </Typography>
                <Typography variant="body1">
                  {toCurrency(cart?.promoTotal || 0)}
                </Typography>
              </StyledRow>
              <StyledRow>
                <Typography variant="subtitle1" textTransform="uppercase">
                  <b>{formatMessage({ id: "shoppingCart.total" })}</b>
                </Typography>
                <Typography variant="h5">
                  <b>{toCurrency(cart?.total || 0)}</b>
                </Typography>
              </StyledRow>
              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  sx={{ mt: { md: 3.5, xs: 2.5 } }}
                  disabled={cart?.number === null}
                  onClick={handleCheckout}
                >
                  {formatMessage({ id: "shoppingCart.checkout" })}
                </Button>
              </Box>
            </Stack>
          </>
        ) : (
          <LcEmptyCart />
        )}
      </Box>
      <LcConfirmationDialog
        open={isDeleteDialogOpened && currentDeleteCartItem !== null}
        title={formatMessage({ id: "shoppingCart.deleteDialog.title" })}
        description={
          currentDeleteCartItem?.product?.inStock > 0
            ? formatMessage(
                { id: "shoppingCart.deleteDialog.description" },
                { productName: currentDeleteCartItem?.product?.name },
              )
            : formatMessage(
                { id: "shoppingCart.deleteDialog.descriptionWithOutOfStock" },
                {
                  productName: currentDeleteCartItem?.product?.name,
                  br: <br />,
                },
              )
        }
        onConfirmClick={handleConfirmDelete}
        onCancelClick={handleCancelDelete}
        isLoading={isDeleting}
      />
    </Drawer>
  );
};
