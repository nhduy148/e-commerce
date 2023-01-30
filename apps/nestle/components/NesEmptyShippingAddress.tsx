import { Box, Button, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface IProps {
  onButtonClick: (event?: any) => void;
}

export const NesEmptyShippingAddress: React.FC<IProps> = ({
  onButtonClick,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 8,
      }}
    >
      <Typography variant="h5" color="primary">
        {formatMessage({ id: "userSetting.noShippingAddress" })}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {formatMessage({ id: "userSetting.noShippingAddressDesc" })}
      </Typography>
      <Button
        size="large"
        variant="contained"
        sx={{ mt: 3 }}
        onClick={(e) => {
          if (typeof onButtonClick === "function") {
            onButtonClick(e);
          }
        }}
      >
        {formatMessage({ id: "userSetting.addAddress" })}
      </Button>
    </Box>
  );
};
