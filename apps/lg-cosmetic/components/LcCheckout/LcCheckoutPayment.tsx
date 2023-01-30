import { IPaymentMethod, IShippingMethod } from "@hera/data";
import { toCurrency } from "@hera/utils";

import { LcStaticImage } from "@lc/components";
import { PAYMENT_METHOD_MAPPING, SHIPPING_METHOD_MAPPING } from "@lc/constants";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FC } from "react";
import { useIntl } from "react-intl";

interface ILcPayment {
  selectedShippingMethod: IShippingMethod | null;
  selectedPaymentMethod: IPaymentMethod | null;
  onShippingMethodChange?: (data?: IShippingMethod) => void;
  onPaymentMethodChange?: (data?: IPaymentMethod) => void;
  onProcess?: (isProcessing?: boolean) => void;
  shippingMethods?: IShippingMethod[];
  paymentMethods?: IPaymentMethod[];
}

export const LcPayment: FC<ILcPayment> = ({
  selectedShippingMethod,
  selectedPaymentMethod,
  onShippingMethodChange,
  onPaymentMethodChange,
  shippingMethods,
  paymentMethods,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const pageContent = {
    shippingMethod: formatMessage({ id: "checkoutPage.shippingMethod" }),
    paymentMethod: formatMessage({ id: "checkoutPage.paymentMethod" }),
    standardDelivery: formatMessage({ id: "checkoutPage.standardDelivery" }),
    fastDelivery: formatMessage({ id: "checkoutPage.fastDelivery" }),
    supportedPaymentMethods: formatMessage({
      id: "checkoutPage.supportedPaymentMethods",
    }),
  };

  return (
    <Box p={{ sm: 4, xs: 2 }}>
      <Box>
        <Typography variant="h5" textTransform="uppercase">
          {pageContent.shippingMethod}
        </Typography>
        <Grid container py={3} spacing={3}>
          {(shippingMethods || []).map((shippingMethod, index) => {
            const isShippingSelected =
              selectedShippingMethod?.id === shippingMethod?.id;
            const shippingData =
              SHIPPING_METHOD_MAPPING[shippingMethod.shippingCode];
            return (
              <Grid item sm={6} xs={12} key={index}>
                <Button
                  color="inherit"
                  fullWidth
                  onClick={() => {
                    if (
                      typeof onShippingMethodChange !== "function" ||
                      isShippingSelected
                    ) {
                      return;
                    }
                    onShippingMethodChange(shippingMethod);
                  }}
                  sx={{
                    border: `${isShippingSelected ? "2px solid" : "none"}`,
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${
                      isShippingSelected
                        ? theme.palette.common.white
                        : theme.palette.grey.A100
                    }`,
                    justifyContent: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    px={1.5}
                    py={2.5}
                  >
                    {shippingData && (
                      <LcStaticImage
                        height={48}
                        width={48}
                        src={shippingData?.image}
                        alt={shippingData?.name || shippingMethod?.name}
                      />
                    )}
                    <Box ml={2} textAlign="left">
                      <Typography variant="subtitle2" textTransform="uppercase">
                        {shippingData?.name || shippingMethod?.name}
                      </Typography>
                      <Typography variant="body2">
                        {toCurrency(shippingMethod.cost)}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Divider />
      <Box pt={3}>
        <Typography variant="h5" textTransform="uppercase">
          {pageContent.paymentMethod}
        </Typography>
        <Grid
          container
          spacing={1.5}
          direction="row"
          sx={{ display: "flex", flexWrap: "wrap", mb: 1.5 }}
        >
          {(paymentMethods || []).map((paymentMethod, index) => {
            const isPaymentSelected =
              selectedPaymentMethod?.id === paymentMethod?.id;
            const paymentData =
              PAYMENT_METHOD_MAPPING[paymentMethod.paymentCode];
            return (
              <Grid
                sm={6}
                xs={12}
                item
                key={index}
                sx={{
                  pointerEvents:
                    selectedShippingMethod === null ? "none" : "default",
                }}
              >
                <Button
                  color="inherit"
                  fullWidth
                  onClick={() => {
                    if (
                      typeof onPaymentMethodChange !== "function" ||
                      isPaymentSelected
                    ) {
                      return;
                    }
                    onPaymentMethodChange(paymentMethod);
                  }}
                  sx={{
                    border: `${isPaymentSelected ? "2px solid" : "none"}`,
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${
                      isPaymentSelected
                        ? theme.palette.common.white
                        : theme.palette.grey[100]
                    }`,
                    justifyContent: "flex-start",
                    opacity: selectedShippingMethod === null ? 0.3 : 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                    p={1.25}
                  >
                    {paymentData && (
                      <LcStaticImage
                        height={24}
                        width={24}
                        src={paymentData?.image}
                        alt={paymentData?.name || paymentMethod?.name}
                      />
                    )}
                    <Box sx={{ ml: { sm: 2, xs: 1 } }}>
                      <Typography variant="overline" textTransform="uppercase">
                        {paymentData?.name || paymentMethod?.name}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
                {paymentData?.subPaymentMethods?.length > 0 && (
                  <Collapse
                    in={isPaymentSelected}
                    collapsedSize="0px"
                    sx={{ mt: 1 }}
                  >
                    <Typography variant="caption" fontWeight="500">
                      {pageContent.supportedPaymentMethods}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      divider={<Divider flexItem orientation="vertical" />}
                      sx={{ mt: 1.5 }}
                    >
                      {paymentData?.subPaymentMethods?.map((item, index) => (
                        <Stack
                          spacing={2}
                          direction="row"
                          justifyContent="center"
                          key={item?.name + index}
                          sx={{ flex: 1 }}
                        >
                          <LcStaticImage
                            height={24}
                            width={24}
                            src={item?.image}
                            alt={item?.name}
                          />
                          <Typography
                            variant="overline"
                            textTransform="uppercase"
                            lineHeight="2.1"
                          >
                            {item?.name}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Collapse>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
