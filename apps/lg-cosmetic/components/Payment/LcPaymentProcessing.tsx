import {
  Box,
  CircularProgress,
  lighten,
  Typography,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";

export const LcPaymentProcessing = () => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
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
      <Box p={10}>
        <CircularProgress sx={{ mb: 4, mx: "auto", display: "block" }} />
        <Typography textAlign="center">
          {formatMessage({ id: "paymentPage.processing" })}
        </Typography>
      </Box>
    </Box>
  );
};
