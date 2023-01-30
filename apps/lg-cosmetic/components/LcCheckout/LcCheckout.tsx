import * as config from "@hera/config";
import { AuthenticationContext } from "@hera/contexts";
import {
  ICartPayment,
  IPaymentMethod,
  IPaymentPlatform,
  IShippingAndBillingAddressPayload,
  IShippingMethod,
  useEstimateShippingCost,
  useGetPaymentMethods,
  useProcessPayment,
  useRefreshCart,
  useRevalidateCart,
  useSelectShippingAndBillingAddress,
  useSetPaymentMethod,
  useSetShippingMethod,
  useUpdateNote,
} from "@hera/data";
import { usePrevious } from "@hera/hooks";
import { isMobileDevice, toCurrency } from "@hera/utils";
import { LcConfirmationDialog, LcGiftItem } from "@lc/components";
import { LcCheckoutShippingAddress, LcPayment } from "@lc/LcCheckoutComponent";
import { gtmEvent, metaPixelEvent } from "@lc/libs";
import { devLog } from "@lc/utils";
import {
  ChevronLeft as ChevronLeftIcon,
  ExpandMore as ExportMoreIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Paper,
  Skeleton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { partition } from "lodash-es";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { LcCheckoutProductItem } from "./LcCheckoutProductItem";
import { LcCheckoutPromotionForm } from "./LcCheckoutPromotionForm";
import { LcEmptyCart } from "./LcEmptyCart";

const StyledAccordion = styled(Accordion)`
  width: 100%;
  padding: 0 24px;
  ::before {
    height: 0;
  }
  box-shadow: none;

  .MuiAccordionSummary-root {
    display: flex;
    align-items: center;
    padding: 0;
  }

  .MuiAccordionDetails-root {
    padding: 16px 0;
  }
`;

const StyledStepper = styled(Stepper)`
  .MuiStepLabel-label {
    margin-top: 6px;
  }

  .MuiStepIcon-root {
    width: 32px;
    height: 32px;
  }

  .Mui-disabled .MuiStepIcon-root {
    color: ${({ theme }) => theme.palette.common.white};
    border: 1px solid ${({ theme }) => theme.palette.grey.A400};
    border-radius: 50%;
  }

  .Mui-disabled .MuiStepIcon-text {
    fill: ${({ theme }) => theme.palette.text.disabled};
  }
`;

const StyledPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
`;

const StyledGridItem = styled(Grid)`
  position: relative;

  .MuiStepper-root {
    position: absolute;
    width: 80%;
    left: 50%;
    top: -70px;
    transform: translateX(-50%);
  }
`;

export const LcCheckout = () => {
  const theme = useTheme();
  const {
    data: cart,
    isLoading: isCartLoading,
    refetch: refetchCheckoutCart,
    setData: setRefreshCartData,
  } = useRefreshCart();
  const { refetch: revalidateCart } = useRevalidateCart();
  const [isCartChanged, setIsCartChanged] = useState<boolean>(false);
  const cartData = useMemo(() => cart?.data, [cart?.data]);

  useEffect(() => {
    if (cartData?.valid === false && prevActiveStep === 1) {
      setIsCartChanged(true);
    }
  }, [cartData]);

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const [activeStep, setActiveStep] = useState<number>(0);
  const prevActiveStep = usePrevious(activeStep);
  const [note, setNote] = useState<string | null>(null);
  const [isProcessing, setProcessing] = useState<boolean>(false);
  const [selectedShippingMethod, setSelectShippingMethod] =
    useState<IShippingMethod | null>(null);
  const [selectedPaymentMethod, setSelectPaymentMethod] =
    useState<IPaymentMethod | null>(null);
  const [shippingInfo, setShippingInfo] =
    useState<IShippingAndBillingAddressPayload>(null);
  const { isLogin, userInfo } = useContext(AuthenticationContext);

  useEffect(() => {
    if (!isLogin) {
      setShippingInfo(cartData?.shippingAddress);
    }
  }, [isLogin, cartData?.shippingAddress]);

  useEffect(() => {
    (async () => {
      await revalidateCart();
      await refetchCheckoutCart();
    })();
    return () => {
      setActiveStep(0);
      (async () => {
        await revalidateCart();
      })();
    };
  }, []);

  const handleBack = async () => {
    if (activeStep === 1) {
      setProcessing(true);
      await handleRevalidateCart();
      await refetchCheckoutCart();
      setSelectPaymentMethod(null);
      setSelectShippingMethod(null);
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setProcessing(false);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleComfirmWarnings = async () => {
    setProcessing(true);
    try {
      await handleRevalidateCart();
      await refetchCheckoutCart();
    } catch (error) {
      devLog("handleComfirmWarnings errors:", error);
    } finally {
      setIsCartChanged(false);
      setSelectPaymentMethod(null);
      setSelectShippingMethod(null);
      setActiveStep(0);
    }
  };

  const pageContent = {
    shippingAddress: formatMessage({ id: "checkoutPage.shippingAddress" }),
    payment: formatMessage({ id: "checkoutPage.payment" }),
    checkoutInfo: formatMessage({ id: "checkoutPage.checkoutInfo" }),
    note: formatMessage({ id: "checkoutPage.note" }),
    notePlaceholder: formatMessage({ id: "checkoutPage.notePlaceholder" }),
    order: formatMessage({ id: "checkoutPage.order" }),
    promotionCode: formatMessage({ id: "checkoutPage.promotionCode" }),
    promotion: formatMessage({ id: "checkoutPage.promotion" }),
    total: formatMessage({ id: "checkoutPage.total" }),
    deliverFee: formatMessage({ id: "checkoutPage.deliverFee" }),
    subtotal: formatMessage({ id: "checkoutPage.subtotal" }),
    placeOrder: formatMessage({ id: "checkoutPage.placeOrder" }),
    confirm: formatMessage({ id: "common.confirm" }),
    goBack: formatMessage({ id: "common.goBack" }),
    dialogTitle: formatMessage({ id: "checkoutPage.cartChangedDialog.title" }),
    dialogDescription: formatMessage(
      {
        id: "checkoutPage.cartChangedDialog.description",
      },
      { br: <br /> },
    ),
    dialogConfirmText: formatMessage({
      id: "checkoutPage.cartChangedDialog.confirmText",
    }),
    noShippingMethodAvailable: formatMessage(
      { id: "checkoutPage.noShippingMethodAvailable" },
      {
        action: (
          <>
            {" "}
            <Link underline="none" onClick={handleBack} href="#">
              {formatMessage({ id: "checkoutPage.reChoiceShippingMethod" })}
            </Link>
          </>
        ),
        br: <br />,
      },
    ),
    processPaymentFailed: formatMessage({
      id: "checkoutPage.processPaymentFailed",
    }),
    setShippingMethodFailed: formatMessage({
      id: "checkoutPage.setShippingMethodFailed",
    }),
    setPaymentMethodFailed: formatMessage({
      id: "checkoutPage.setPaymentMethodFailed",
    }),
  };

  const {
    data: shippingData,
    isLoading: isEstimatingShippingCost,
    refetch: refetchEstimatingShippingCost,
  } = useEstimateShippingCost(activeStep === 1);

  const shippingMethods = useMemo(
    () => shippingData?.data || [],
    [shippingData?.data],
  );
  const { data: paymentMethods, isLoading: isPaymentListLoading } =
    useGetPaymentMethods(activeStep === 1);
  const { mutateAsync: selectShippingAndBillingAddress } =
    useSelectShippingAndBillingAddress();
  const { mutateAsync: setShippingMethodAsync } = useSetShippingMethod();
  const { mutateAsync: setPaymentMethodAsync } = useSetPaymentMethod();
  const { mutateAsync: processPayment } = useProcessPayment();
  const { mutateAsync: updateNoteAsync } = useUpdateNote();

  const handleRevalidateShippingFee = useCallback(async () => {
    await refetchEstimatingShippingCost();
    const newShippingCost =
      shippingMethods?.find(
        (shippingMethod) => shippingMethod.id === selectedShippingMethod?.id,
      ) || null;
    if (newShippingCost?.cost !== selectedShippingMethod?.cost) {
      setIsCartChanged(true);
      return false;
    }
    return true;
  }, []);

  const handleRevalidateCart = useCallback(async () => {
    setProcessing(true);
    try {
      await revalidateCart();
    } catch (error) {
      devLog("handleRevalidateCart errors:", error);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleSetShippingMethodAsync = async (
    shippingMethod: IShippingMethod,
  ) => {
    setProcessing(true);
    try {
      const data = await setShippingMethodAsync({
        shippingMethodId: shippingMethod.id,
      });
      setSelectShippingMethod(shippingMethod);
      setRefreshCartData(data);
    } catch (error) {
      devLog("Set Shipping Method ~ error:", error);
      enqueueSnackbar(pageContent.setShippingMethodFailed, {
        variant: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSetPaymentMethodAsync = async (paymentMethod: IPaymentMethod) => {
    setProcessing(true);
    try {
      const canSelectPaymentMethod = await handleRevalidateShippingFee();
      if (!canSelectPaymentMethod) {
        return;
      }
      const data = await setPaymentMethodAsync({
        paymentMethodId: paymentMethod?.id,
      });
      setSelectPaymentMethod(paymentMethod);
      setRefreshCartData(data);
    } catch (error) {
      devLog("Set Payment Method ~ error:", error);
      enqueueSnackbar(pageContent.setPaymentMethodFailed, { variant: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessPaymentAsync = async () => {
    if (!selectedPaymentMethod) {
      return;
    }
    setProcessing(true);
    let platform: IPaymentPlatform = "web";
    let callbackURL = null;
    try {
      const { data: newCartData } = await refetchCheckoutCart();
      if (!cartData) {
        throw new Error("Missing {cartData}");
      }
      if (!newCartData?.data?.valid) {
        return;
      }
      const payments: ICartPayment[] = cartData?.payments;
      const payment = payments.find((payment) => payment.state === "pending");
      if (!payment?.id) {
        throw new Error("Missing {paymentId}");
      }
      if (selectedPaymentMethod?.paymentCode === "momo") {
        callbackURL = `${config.env.siteUrl}payment/callback/momo?paymentId=${payment.id}&orderNumber=${newCartData.data.number}`;
        if (isMobileDevice.test(navigator?.userAgent)) {
          platform = "momo_app";
        } else {
          platform = "momo_web";
        }
      } else if (selectedPaymentMethod?.paymentCode === "baokim") {
        callbackURL = `${config.env.siteUrl}payment/callback/baokim?paymentId=${payment.id}&orderNumber=${newCartData.data.number}`;
        platform = "baokim";
      }
      if (typeof note === "string" && note.length > 0 && !/^ *$/.test(note)) {
        try {
          await updateNoteAsync({ specialInstructions: note });
        } catch (error) {
          throw new Error(error);
        }
      }
      const { data: response } = await processPayment({
        paymentId: payment.id,
        platform,
        // @ts-ignore
        callbackURL,
      });
      gtmEvent("purchase", cartData);
      metaPixelEvent("Purchase", cartData);
      if (response.action === "redirect") {
        window.location.href = response.url;
      } else if (response.action === "next") {
        setNote(null);
        localStorage.setItem(
          config.env.lastPaymentKey,
          JSON.stringify({
            orderNumber: cartData.number,
            paymentId: payment.id,
            status: "success",
          }),
        );
        localStorage.removeItem(config.env.shoppingCartKey);

        await push(`/payment/success`);
      }
    } catch (error) {
      devLog("Process Payment ~ error:", error);
      enqueueSnackbar(pageContent.processPaymentFailed, { variant: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      setProcessing(true);
      try {
        if (isLogin || cartData.state === "cart") {
          await selectShippingAndBillingAddress(shippingInfo);
        }
        setActiveStep(1);
      } catch (error) {
        devLog(
          "Select shipping and billing address || Estimate Shipping Cost ~!~ error:",
          error,
        );
      } finally {
        setProcessing(false);
      }
    } else if (activeStep == 1) {
      handleProcessPaymentAsync();
    }
    window?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  };

  const disableButton: boolean = useMemo(() => {
    const validShippingAddress =
      cartData?.shippingAddress?.email?.includes("@") ||
      shippingInfo?.email?.includes("@");
    const validProducts = cartData?.lineItems?.every((lineItem) => {
      return lineItem?.isOrderable === true;
    });

    if (activeStep === 0) {
      return (
        !cartData?.valid ||
        !validProducts ||
        (isLogin && !validShippingAddress) ||
        (!isLogin && !validShippingAddress)
      );
    }
    if (activeStep === 1) {
      return (
        !cartData?.valid ||
        !validProducts ||
        !selectedPaymentMethod ||
        !selectedShippingMethod
      );
    }
  }, [
    cartData?.valid,
    cartData?.shippingAddress,
    cartData?.lineItems,
    shippingInfo,
    activeStep,
    isLogin,
    selectedPaymentMethod,
    selectedShippingMethod,
  ]);

  const renderPayment = () => {
    if (isEstimatingShippingCost || isPaymentListLoading) {
      return (
        <Box>
          <Stack direction="row" spacing={2} sx={{ p: 2 }}>
            {[...Array(4).keys()].map(() => (
              <Skeleton variant="rectangular" width="100%" height={60} />
            ))}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2, p: 2 }}>
            {[...Array(4).keys()].map(() => (
              <Skeleton variant="rectangular" width="100%" height={60} />
            ))}
          </Stack>
        </Box>
      );
    }

    if (shippingMethods?.length > 0) {
      return (
        <Box>
          <LcPayment
            shippingMethods={shippingMethods}
            paymentMethods={paymentMethods}
            selectedShippingMethod={selectedShippingMethod}
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={handleSetPaymentMethodAsync}
            onShippingMethodChange={handleSetShippingMethodAsync}
            onProcess={(isProcessing) => setProcessing(isProcessing)}
          />
          <Box px={{ md: 4, xs: 2 }} pb={{ md: 3, xs: 1.5 }}>
            <Typography variant="h6" textTransform="uppercase" sx={{ mb: 1 }}>
              {pageContent.note}
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
              placeholder={pageContent.notePlaceholder}
            />
          </Box>
        </Box>
      );
    }
    return (
      <Box py={{ md: 5, xs: 2 }} px={{ md: 4, xs: 1.5 }}>
        <Typography>{pageContent.noShippingMethodAvailable}</Typography>
      </Box>
    );
  };

  const renderShipping = (
    <LcCheckoutShippingAddress
      shippingAddress={cartData?.shippingAddress || null}
      isCartLoading={isCartLoading}
      onShippingAddressChange={(data) => {
        const payload: IShippingAndBillingAddressPayload = {
          addressLine1: data?.addressLine,
          district: data?.district?.name,
          ward: data?.ward?.name,
          province: data?.province?.name,
          districtId: data?.district?.id,
          wardId: data?.ward?.id,
          provinceId: data?.province?.id,
          lastName: data?.lastName,
          firstName: data?.firstName,
          phone: data?.phone,
          email: userInfo?.email || null,
          id: data?.id,
          displayName: data?.displayName,
        };
        setShippingInfo(payload);
      }}
    />
  );

  const steps = [
    {
      label: pageContent.shippingAddress,
      content: renderShipping,
    },
    {
      label: pageContent.payment,
      content: renderPayment(),
    },
  ];

  const [gifts, lineItems] = useMemo(
    () =>
      partition(
        cartData?.lineItems || [],
        (lineItem) => lineItem.label === "gift",
      ),
    [cartData],
  );

  const renderSide = (
    <Box>
      <Typography
        variant="h5"
        textTransform="uppercase"
        sx={{ p: { md: 3, xs: 2 } }}
      >
        {pageContent.order}
      </Typography>
      <Divider />
      <Box
        maxHeight={300}
        overflow="auto"
        sx={{ overscrollBehavior: "contain", p: { md: 2, xs: 1 } }}
      >
        {lineItems
          .sort((a, b) => a.id - b.id)
          .map((lineItem, index) => (
            <>
              <LcCheckoutProductItem lineItem={lineItem} key={index} />
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
      <Divider />
      {activeStep === 0 ||
      (cartData?.promoCode?.length > 0 && activeStep === 1) ? (
        <>
          <StyledAccordion disableGutters sx={{ px: { md: 2, xs: 1 } }}>
            <AccordionSummary expandIcon={<ExportMoreIcon />}>
              <Typography textTransform="uppercase">
                {pageContent.promotionCode}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LcCheckoutPromotionForm
                promoCode={cartData?.promoCode}
                enabled={activeStep === 0}
              />
            </AccordionDetails>
          </StyledAccordion>
          <Divider />
        </>
      ) : null}
      <Stack spacing={1} sx={{ p: { md: 2, xs: 1 } }}>
        {activeStep === 1 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">{pageContent.deliverFee}</Typography>
            <Typography variant="body2">
              {toCurrency(cartData?.shippingTotal || 0)}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">{pageContent.subtotal}</Typography>
          <Typography variant="body2">
            {toCurrency(cartData?.subTotal || 0)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">{pageContent.promotion}</Typography>
          <Typography variant="body2">
            {toCurrency(cartData?.promoTotal || 0)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" textTransform="uppercase">
            {pageContent.total}
          </Typography>
          <Typography variant="h6">
            {toCurrency(cartData?.total || 0)}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            fullWidth
            disabled={disableButton}
            onClick={handleNext}
          >
            {pageContent.placeOrder}
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  const renderContent = () => {
    if (isCartLoading) {
      return (
        <Box display="flex" justifyContent="space-between">
          <Skeleton height={500} width="59%" />
          <Skeleton height={500} width="39%" />
        </Box>
      );
    }
    if (cartData?.lineItems?.length > 0) {
      return (
        <Grid container rowSpacing={2} columnSpacing={4}>
          <StyledGridItem item sm={8} xs={12}>
            <StyledStepper activeStep={activeStep} alternativeLabel>
              {steps.map(({ label }, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </StyledStepper>
            <StyledPaper square>
              <Box>
                {activeStep > 0 && (
                  <Box mx={3} mt={2}>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<ChevronLeftIcon fontSize="inherit" />}
                      onClick={handleBack}
                    >
                      {pageContent.goBack}
                    </Button>
                  </Box>
                )}
                {steps[activeStep]?.content}
              </Box>
            </StyledPaper>
          </StyledGridItem>
          <Grid item sm={4} xs={12}>
            <StyledPaper square>{renderSide}</StyledPaper>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Box my={{ md: 7, xs: 4 }}>
          <LcEmptyCart />
        </Box>
      );
    }
  };

  return (
    <>
      <Box mb={5}>
        <Typography
          textTransform="uppercase"
          variant="h5"
          mb={cartData?.lineItems?.length > 0 ? 15 : 0}
        >
          {pageContent.checkoutInfo}
        </Typography>
        {renderContent()}
      </Box>
      <LcConfirmationDialog
        open={isCartChanged}
        title={pageContent.dialogTitle}
        description={pageContent.dialogDescription}
        onlyConfirmation
        confirmText={pageContent.dialogConfirmText}
        onConfirmClick={handleComfirmWarnings}
      />
      <Backdrop
        open={isProcessing || isEstimatingShippingCost}
        sx={{ zIndex: 9999 }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={1}
          width={1}
        >
          <CircularProgress />
        </Box>
      </Backdrop>
    </>
  );
};
