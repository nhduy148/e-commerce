import { IPaymentMethod, IShippingMethod } from "@hera/data";
import { toCurrency } from "@hera/utils";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { NesStaticImage } from "@nestle/components";
import {
  PAYMENT_METHOD_MAPPING,
  SHIPPING_METHOD_MAPPING,
} from "@nestle/constants";
import { FC } from "react";
import { useIntl } from "react-intl";

interface INesPayment {
  selectedShippingMethod: IShippingMethod | null;
  selectedPaymentMethod: IPaymentMethod | null;
  onShippingMethodChange?: (data?: IShippingMethod) => void;
  onPaymentMethodChange?: (data?: IPaymentMethod) => void;
  onSetNote?: (note?: string) => void;
  note?: string;
  notePlaceholder?: string;
  shippingMethods?: IShippingMethod[];
  paymentMethods?: IPaymentMethod[];
}

export const NesPayment: FC<INesPayment> = ({
  selectedShippingMethod,
  selectedPaymentMethod,
  onShippingMethodChange,
  onPaymentMethodChange,
  onSetNote,
  note,
  notePlaceholder,
  shippingMethods,
  paymentMethods,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const pageContent = {
    shippingMethod: formatMessage({ id: "checkoutPage.shippingMethod" }),
    paymentMethod: formatMessage({ id: "checkoutPage.paymentMethod" }),
    note: formatMessage({ id: "checkoutPage.note" }),
    checkoutInfo: formatMessage({ id: "checkoutPage.checkoutInfo" }),
    deliveryMethod: formatMessage({ id: "checkoutPage.deliveryMethod" }),
    supportedPaymentMethods: formatMessage({
      id: "checkoutPage.supportedPaymentMethods",
    }),
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.custom.primaryBackground,
        borderRadius: "10px",
      }}
    >
      {/* DELIVERY METHOD */}
      <Box
        sx={{
          backgroundColor: theme.palette.common.white,
          mb: 2,
          borderRadius: "10px",
          boxShadow: theme.shadows[2],
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1.5,
          }}
        >
          <Typography variant="h6">{pageContent.deliveryMethod}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            pt: 1.5,
            px: 2,
            pb: 2,
          }}
        >
          <Grid container spacing={3}>
            {(shippingMethods || []).map((shippingMethod, index) => {
              const isShippingSelected =
                selectedShippingMethod?.id === shippingMethod?.id;
              const shippingData =
                SHIPPING_METHOD_MAPPING[shippingMethod.shippingCode];
              return (
                <Grid item sm={6} xs={12} key={index}>
                  <Button
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
                          : theme.palette.grey[100]
                      }`,
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {shippingData && (
                        <NesStaticImage
                          height={48}
                          width={48}
                          src={shippingData?.image}
                          alt={shippingData?.name || shippingMethod?.name}
                        />
                      )}
                      <Box ml={2} textAlign="left">
                        <Typography variant="subtitle1">
                          {shippingData?.name || shippingMethod?.name}
                        </Typography>
                        {shippingMethod.originalCost > shippingMethod.cost ? (
                          <Stack
                            spacing={1}
                            direction="row"
                            alignItems="flex-end"
                          >
                            <Typography
                              variant="body2"
                              color={theme.palette.grey[500]}
                              sx={{ textDecoration: "line-through" }}
                            >
                              {toCurrency(shippingMethod.originalCost)}
                            </Typography>

                            <Typography variant="body2">
                              {toCurrency(shippingMethod.cost)}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="body2">
                            {toCurrency(shippingMethod.cost)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      {/* PAYMENT METHOD */}
      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: theme.palette.common.white,
          boxShadow: theme.shadows[2],
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1.5,
          }}
        >
          <Typography variant="h6">{pageContent.paymentMethod}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 2,
          }}
        >
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
                      px: 1.5,
                      py: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {paymentData && (
                        <NesStaticImage
                          height={24}
                          width={24}
                          src={paymentData?.image}
                          alt={paymentData?.name || paymentMethod?.name}
                        />
                      )}
                      <Box sx={{ ml: { sm: 2, xs: 1 } }}>
                        <Typography
                          variant="overline"
                          textTransform="uppercase"
                          fontWeight={isPaymentSelected ? "700" : "400"}
                        >
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
                      <Typography variant="overline" fontWeight="500">
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
                            <NesStaticImage
                              height={24}
                              width={24}
                              src={item?.image}
                              alt={item?.name}
                            />
                            <Typography
                              variant="overline"
                              textTransform="uppercase"
                              fontWeight={isPaymentSelected ? "700" : "400"}
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

          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {pageContent.note}
            </Typography>
            <TextField
              size="small"
              multiline
              fullWidth
              rows={2}
              value={note}
              onChange={(e) => onSetNote(e.target.value)}
              variant="outlined"
              placeholder={notePlaceholder}
              InputProps={{
                sx: {
                  p: 1,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
