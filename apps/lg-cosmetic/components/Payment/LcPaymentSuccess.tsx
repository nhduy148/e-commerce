import { AuthenticationContext } from "@hera/contexts";
import { PaymentSuccess } from "@lc/static/images";
import { Box, Button, lighten, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { useIntl } from "react-intl";

interface IProps {
  orderNumber?: string;
}

export const LcPaymentSuccess: FC<IProps> = ({ orderNumber }) => {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const theme = useTheme();
  const { isLogin: isLoggedIn } = useContext(AuthenticationContext);

  const pageContent = {
    successTitle: formatMessage({ id: "paymentPage.successTitle" }),
    successMessage: formatMessage(
      { id: "paymentPage.successMessage" },
      { br: <br /> },
    ),
    orderHistoryButton: formatMessage({ id: "paymentPage.orderHistoryButton" }),
  };

  return (
    <Box
      sx={{
        padding: {
          md: 4,
          xs: 3,
        },
        backgroundColor: lighten(theme.palette.primary.main, 0.96),
        textAlign: "center",
      }}
    >
      {orderNumber && isLoggedIn && (
        <Typography variant="body1" color="grey.500" sx={{ mb: 2 }}>
          {orderNumber}
        </Typography>
      )}
      <Box textAlign="center" sx={{ mb: { md: 2, xs: 1 } }}>
        <Image src={PaymentSuccess} width={180} height={180} />
      </Box>
      <Typography
        variant="h5"
        textTransform="uppercase"
        color="primary.main"
        sx={{ mb: { sm: 1.5, xs: 1 } }}
      >
        {pageContent.successTitle}
      </Typography>
      <Typography
        variant="body1"
        color="text.main"
        sx={{
          mb: { md: 2, xs: 1.5 },
        }}
      >
        {pageContent.successMessage}
      </Typography>
      {isLoggedIn && (
        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{ maxWidth: 360 }}
          onClick={() => push("/account/order")}
        >
          {pageContent.orderHistoryButton}
        </Button>
      )}
    </Box>
  );
};
