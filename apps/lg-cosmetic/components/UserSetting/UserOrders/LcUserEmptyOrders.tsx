import { Box, Button, Typography } from "@mui/material";
import router from "next/router";
import { useIntl } from "react-intl";
type Props = {};

export const LcUserEmptyOrders = (props: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="h5" color="primary.main">
          {formatMessage({ id: "userSetting.noOrder" })}
        </Typography>
        <Typography variant="body1">
          {formatMessage({ id: "userSetting.noOrderDesc" })}
        </Typography>
      </Box>
      <Button
        color="primary"
        variant="contained"
        size="small"
        sx={{ mt: 3 }}
        onClick={() => router.push("/products")}
      >
        {formatMessage({ id: "userSetting.noOrderAction" })}
      </Button>
    </Box>
  );
};
