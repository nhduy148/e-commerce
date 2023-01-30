import { Box, Button, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface IProps {
  onButtonClick: (any?: any) => void;
}

export const LcUserEmptyShippingAddress: React.FC<IProps> = ({
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
        size="small"
        variant="contained"
        sx={{ mt: 3 }}
        onClick={onButtonClick && onButtonClick}
      >
        {formatMessage({ id: "userSetting.addAddress" })}
      </Button>
    </Box>
  );
};
