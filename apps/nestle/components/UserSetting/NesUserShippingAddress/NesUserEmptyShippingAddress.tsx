import { Box, Button, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface IProps {
  onSetModalInitData: (data: null) => void;
  onSetIsModalOpen: (isOpen: boolean) => void;
}

export const NesUserEmptyShippingAddress: React.FC<IProps> = ({
  onSetModalInitData,
  onSetIsModalOpen,
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
        color="primary"
        size="large"
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => {
          onSetModalInitData(null);
          onSetIsModalOpen(true);
        }}
      >
        {formatMessage({ id: "userSetting.addAddress" })}
      </Button>
    </Box>
  );
};
