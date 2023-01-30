import { PaymentFailed } from "@lc/static/images";
import { Box, Button, lighten, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";
import { useIntl } from "react-intl";

export const LcEmptyCart: FC = () => {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const theme = useTheme();

  const pageContent = {
    title: formatMessage({ id: "checkoutPage.emptyTitle" }),
    description: formatMessage({ id: "checkoutPage.emptyDescription" }),
    button: formatMessage({ id: "checkoutPage.emptyButton" }),
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
      <Box textAlign="center" sx={{ mb: { md: 2, xs: 1 } }}>
        <Image src={PaymentFailed} width={180} height={180} />
      </Box>
      <Typography
        variant="h5"
        textTransform="uppercase"
        color="primary.main"
        sx={{ mb: { md: 1.5, xs: 1 } }}
      >
        {pageContent.title}
      </Typography>
      <Typography
        variant="body1"
        color="text.main"
        sx={{
          mb: { md: 2, xs: 1.5 },
        }}
      >
        {pageContent.description}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        size="small"
        sx={{ maxWidth: 360 }}
        onClick={() => push("/products")}
      >
        {pageContent.button}
      </Button>
    </Box>
  );
};
