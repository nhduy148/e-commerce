import { useGetShippingInfo } from "@hera/data";
import { shippingInfoInitialValues } from "@lc/validations";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { LcShippingAddressModal } from "../../LcModals/LcShippingAddressModal";
import { LcShippingAddressItem } from "../../LcShippingAddressItem";
import { LcUserEmptyShippingAddress } from "./LcUserEmptyShippingAddress";

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

export const LcUserShippingAddress: React.FunctionComponent = () => {
  const {
    data: shippingAddressData,
    isSuccess: getShippingAddressSuccess,
    isLoading: getShippingAddressLoading,
  } = useGetShippingInfo(true);

  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const sortedShippingAddressData = shippingAddressData?.sort((a, b) => {
    if (a.isDefault) {
      return -1;
    }
    if (b.isDefault) {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    if (isModalOpen === false) {
      setSelectedAddress(
        shippingAddressData?.find(
          (address) =>
            address?.id === selectedAddress?.id || address?.isDefault,
        ),
      );
    }
  }, [isModalOpen]);

  const { formatMessage } = useIntl();

  return (
    <SettingMenuPaper elevation={3} sx={{ p: { xs: 2 } }}>
      <Box>
        <Typography variant="h5" color="text.main" textTransform="uppercase">
          {formatMessage({ id: "userSetting.shippingAddressInfo" })}
        </Typography>

        <Box>
          {getShippingAddressLoading ? (
            <CircularProgress size={50} />
          ) : sortedShippingAddressData?.length > 0 ? (
            <Box>
              <Stack
                spacing={2}
                mb={2}
                sx={{ maxHeight: 300, overflowY: "auto" }}
                mt={3}
              >
                {sortedShippingAddressData?.map((shippingAddress, index) => {
                  return (
                    <LcShippingAddressItem
                      key={shippingAddress.id}
                      data={shippingAddress}
                      index={index + 1}
                      clickAction="check"
                      selected={
                        shippingAddress?.id === selectedAddress?.id
                          ? true
                          : false
                      }
                      onClick={() => setSelectedAddress(shippingAddress)}
                    />
                  );
                })}
              </Stack>
              <Stack
                spacing={2}
                direction="row"
                sx={{ justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{ width: { sm: "fit-content", xs: "100%" } }}
                  size="small"
                  onClick={() => setIsModalOpen(true)}
                >
                  {formatMessage({ id: "userSetting.edit" })}
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: { sm: "fit-content", xs: "100%" } }}
                  size="small"
                  onClick={() => {
                    setSelectedAddress(shippingInfoInitialValues);
                    setIsModalOpen(true);
                  }}
                >
                  {formatMessage({ id: "userSetting.create" })}
                </Button>
              </Stack>
            </Box>
          ) : (
            <LcUserEmptyShippingAddress
              onButtonClick={() => {
                setSelectedAddress(shippingInfoInitialValues);
                setIsModalOpen(true);
              }}
            />
          )}
        </Box>
        <LcShippingAddressModal
          shippingInfo={selectedAddress}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Box>
    </SettingMenuPaper>
  );
};
