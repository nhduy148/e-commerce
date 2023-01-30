import { IShippingInfo, useGetShippingInfo } from "@hera/data";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { NesShippingAddressModal } from "../../NesModals/NesShippingAddressModal";
import { NesShippingAddressItem } from "../../NesShippingAddressItem";
import { NesUserEmptyShippingAddress } from "./NesUserEmptyShippingAddress";

export const NesUserShippingAddress: React.FunctionComponent = () => {
  const {
    data: shippingAddressData,
    isSuccess: getShippingAddressSuccess,
    isLoading: getShippingAddressLoading,
    refetch,
  } = useGetShippingInfo(true);

  const [selectedAddress, setSelectedAddress] = React.useState(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalInitData, setModalInitData] = React.useState<IShippingInfo>();

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
    if (getShippingAddressSuccess) {
      setSelectedAddress(sortedShippingAddressData[0] || null);
    }
  }, [getShippingAddressSuccess, shippingAddressData]);

  const { formatMessage } = useIntl();

  return (
    <Box>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
        }}
      >
        <Typography variant="h6" color="text.primary">
          {formatMessage({ id: "userSetting.shippingAddressInfo" })}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 2.5,
        }}
      >
        {getShippingAddressLoading ? (
          <CircularProgress size={50} />
        ) : sortedShippingAddressData?.length > 0 ? (
          <Box>
            <Stack
              spacing={2}
              mb={2}
              sx={{ maxHeight: 300, overflowY: "auto" }}
            >
              {sortedShippingAddressData?.map((shippingAddress, index) => {
                return (
                  <NesShippingAddressItem
                    key={shippingAddress.id}
                    data={shippingAddress}
                    index={index + 1}
                    clickAction="check"
                    selected={
                      shippingAddress?.id === selectedAddress?.id ? true : false
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
                variant="outlined"
                color="inherit"
                sx={{ width: { sm: "fit-content", xs: "100%" } }}
                size="large"
                onClick={() => {
                  setModalInitData(selectedAddress);
                  setIsModalOpen(true);
                }}
              >
                {formatMessage({ id: "userSetting.edit" })}
              </Button>
              <Button
                variant="contained"
                sx={{ width: { sm: "fit-content", xs: "100%" } }}
                size="large"
                onClick={() => {
                  setModalInitData(null);
                  setIsModalOpen(true);
                }}
              >
                {formatMessage({ id: "userSetting.create" })}
              </Button>
            </Stack>
          </Box>
        ) : (
          <NesUserEmptyShippingAddress
            onSetIsModalOpen={setIsModalOpen}
            onSetModalInitData={setModalInitData}
          />
        )}
      </Box>
      <NesShippingAddressModal
        shippingInfo={modalInitData}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};
