import { useRefreshCart } from "@hera/data";
import { toCurrency } from "@hera/utils";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerProps,
  ListSubheader,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { NesCartList, NesIconButton } from "@nestle/components";
import { useCart } from "@nestle/hooks";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useIntl } from "react-intl";

import { NesEmptyCart } from "./NesEmptyCart";

interface ICart extends Omit<DrawerProps, "onClose"> {
  onClose: (e?: any) => void;
}

const StyledRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NesShoppingCart: FC<ICart> = ({ onClose, open, ...props }) => {
  const { push, asPath } = useRouter();
  const { data: cart, refetch: refetchShoppingCart } = useCart();
  const { refetch: refetchCheckoutCart } = useRefreshCart();
  const { formatMessage } = useIntl();
  const shoppingCartItemAvailable = formatMessage(
    { id: "shoppingCart.totalItems" },
    { total: cart?.itemCount || 0 },
  );

  useEffect(() => {
    if (open) {
      refetchShoppingCart();
    }
  }, [open]);

  const handleClose = async (e) => {
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
          }}
        >
          <NesIconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              left: 22,
              marginLeft: "-16px",
            }}
            iconName="close"
          />

          <Typography
            variant="h5"
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
            }}
          >
            {formatMessage({ id: "shoppingCart.title" })}
          </Typography>
        </Box>
        <Divider />
        {cart?.lineItems?.length > 0 ? (
          <>
            <Box
              flex={1}
              height={300}
              sx={{
                px: 2,
                pt: 2,
                pb: 1.5,
              }}
              display="flex"
              flexDirection="column"
              overflow="auto"
            >
              <ListSubheader disableGutters>
                <Typography variant="body2" color="grey.A700">
                  <b>{shoppingCartItemAvailable}</b>
                </Typography>
              </ListSubheader>
              <Box flex={1} pb={2}>
                <NesCartList
                  itemType="shoppingCart"
                  lineItems={cart?.lineItems || []}
                />
              </Box>
            </Box>
            <Divider />
            <Stack py={{ md: 2, xs: 1 }} px={{ md: 2, xs: 1 }} spacing={1}>
              <StyledRow>
                <Typography variant="body1">
                  {formatMessage({ id: "shoppingCart.subTotal" })}
                </Typography>
                <Typography variant="subtitle1">
                  {toCurrency(cart?.subTotal || 0)}
                </Typography>
              </StyledRow>
              <StyledRow>
                <Typography variant="body1">
                  {formatMessage({ id: "shoppingCart.promoTotal" })}
                </Typography>
                <Typography variant="subtitle1">
                  {toCurrency(cart?.promoTotal || 0)}
                </Typography>
              </StyledRow>
              <StyledRow>
                <Typography variant="body1">
                  <b>{formatMessage({ id: "shoppingCart.total" })}</b>
                </Typography>
                <Typography variant="subtitle1">
                  <b>{toCurrency(cart?.total || 0)}</b>
                </Typography>
              </StyledRow>
              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: { sm: 2, xs: 1 } }}
                  disabled={cart?.number === null}
                  onClick={handleCheckout}
                >
                  {formatMessage({ id: "shoppingCart.checkout" })}
                </Button>
              </Box>
            </Stack>
          </>
        ) : (
          <NesEmptyCart />
        )}
      </Box>
    </Drawer>
  );
};
