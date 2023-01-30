import { AuthenticationContext } from "@hera/contexts";
import {
  IShippingAndBillingAddressShape,
  IShippingInfo,
  useGetShippingInfo,
} from "@hera/data";
import { LcEmptyShippingAddress, LcShippingAddressItem } from "@lc/components";
import {
  LcGuestSelectShippingAddressModal,
  LcShippingAddressModal,
} from "@lc/ModalComponents";
import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Divider, styled, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

interface ILcCheckoutShippingAddress {
  shippingAddress?: IShippingAndBillingAddressShape;
  isCartLoading?: boolean;
  onShippingAddressChange?: (data?: IShippingInfo) => void;
}

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const LcCheckoutShippingAddress: FC<ILcCheckoutShippingAddress> = ({
  shippingAddress,
  isCartLoading,
  onShippingAddressChange,
}) => {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  const [selected, setSeleted] = useState<IShippingInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGuestModalOpen, setOpenGuestModal] = useState<boolean>(false);
  const { isLogin: isLogin } = useContext(AuthenticationContext);
  const { data: shippingAddresses = [], refetch: refetchShippingAddresses } =
    useGetShippingInfo(isLogin);

  const pageContent = {
    shippingAddress: formatMessage({ id: "checkoutPage.shippingAddress" }),
    create: formatMessage({ id: "checkoutPage.create" }),
    updateShippingAddress: formatMessage({
      id: "checkoutPage.updateShippingAddress",
    }),
    buyerInfo: formatMessage({ id: "modals.shippingInfo.clientInfo" }),
    addressInfo: formatMessage({ id: "modals.shippingInfo.addressInfo" }),
    setAsDefault: formatMessage({ id: "modals.shippingInfo.setAsDefault" }),
    fullName: formatMessage({ id: "common.fullName" }),
    phone: formatMessage({ id: "common.phone" }),
    email: formatMessage({ id: "common.email" }),
    province: formatMessage({ id: "common.province" }),
    district: formatMessage({ id: "common.district" }),
    address: formatMessage({ id: "common.address" }),
    ward: formatMessage({ id: "common.ward" }),
    emptyCart: formatMessage({ id: "common.emptyCart" }),
    buyNow: formatMessage({ id: "common.buyNow" }),
  };

  useEffect(() => {
    if (shippingAddresses?.length > 0 && isLogin) {
      const initSelected =
        shippingAddresses?.find(({ isDefault }) => isDefault === true) ||
        shippingAddresses[0];
      onShippingAddressChange && onShippingAddressChange(initSelected);
      setSeleted(initSelected);
    }
  }, [shippingAddresses, isLogin]);

  const renderContent = () => {
    if (isLogin) {
      return (
        <Box mt={3}>
          <Box
            maxHeight={300}
            overflow="auto"
            mb={2}
            sx={{ overscrollBehavior: "contain" }}
          >
            {shippingAddresses
              .sort((x, y) =>
                x.isDefault === y.isDefault ? 0 : x.isDefault ? -1 : 1,
              )
              .map((data, index) => (
                <Box key={index} mb={1}>
                  <LcShippingAddressItem
                    data={data}
                    index={index + 1}
                    clickAction="check"
                    selected={selected?.id === data?.id}
                    onClick={(data) => {
                      setSeleted(data);
                      onShippingAddressChange && onShippingAddressChange(data);
                    }}
                  />
                </Box>
              ))}
          </Box>
          <Button
            variant="text"
            color="inherit"
            startIcon={<AddIcon />}
            size="medium"
            onClick={() => setIsModalOpen(true)}
          >
            {pageContent.create}
          </Button>
          <LcShippingAddressModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => refetchShippingAddresses()}
            open={isModalOpen}
          />
        </Box>
      );
    }
    if (shippingAddress?.email?.includes("@")) {
      return (
        <Box mt={2}>
          <Box mb={2}>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              <b>{pageContent.buyerInfo}</b>
            </Typography>
            {(shippingAddress?.firstName || shippingAddress?.lastName) && (
              <StyledBox>
                <Typography variant="body2">
                  {`${pageContent.fullName}: `}
                </Typography>
                <Typography variant="body1" sx={{ ml: 0.5 }}>
                  <b>
                    {shippingAddress?.displayName ||
                      [shippingAddress?.firstName, shippingAddress?.lastName]
                        .filter(Boolean)
                        .join(" ")}
                  </b>
                </Typography>
              </StyledBox>
            )}
            {shippingAddress?.phone && (
              <StyledBox>
                <Typography variant="body2">
                  {`${pageContent.phone}: `}
                </Typography>
                <Typography variant="body1" sx={{ ml: 0.5 }}>
                  <b>{shippingAddress?.phone}</b>
                </Typography>
              </StyledBox>
            )}
            {shippingAddress?.email && (
              <StyledBox>
                <Typography variant="body2">
                  {`${pageContent.email}: `}
                </Typography>
                <Typography variant="body1" sx={{ ml: 0.5 }}>
                  <b>{shippingAddress?.email}</b>
                </Typography>
              </StyledBox>
            )}
          </Box>
          <Box mb={2}>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              <b>{pageContent.addressInfo}</b>
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              <b>
                {[
                  shippingAddress?.addressLine1,
                  shippingAddress?.ward,
                  shippingAddress?.district,
                  shippingAddress?.province,
                ]
                  .filter(Boolean)
                  // @ts-ignore
                  .map((part) => part?.name || part)
                  .join(", ")}
              </b>
            </Typography>
          </Box>
          <Divider />
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => setOpenGuestModal(true)}
          >
            {pageContent.updateShippingAddress}
          </Button>
          <LcGuestSelectShippingAddressModal
            open={isGuestModalOpen}
            shippingAddress={shippingAddress}
            onSuccess={() => setOpenGuestModal(false)}
          />
        </Box>
      );
    }
    return (
      <>
        <LcEmptyShippingAddress onButtonClick={() => setOpenGuestModal(true)} />
        <LcGuestSelectShippingAddressModal
          open={isGuestModalOpen}
          shippingAddress={shippingAddress}
          onSuccess={() => setOpenGuestModal(false)}
        />
      </>
    );
  };

  return (
    <Box p={{ sm: 4, xs: 2 }}>
      <Typography variant="h5" textTransform="uppercase">
        {pageContent.shippingAddress}
      </Typography>
      {renderContent()}
    </Box>
  );
};
