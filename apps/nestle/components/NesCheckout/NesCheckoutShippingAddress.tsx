import { AuthenticationContext } from "@hera/contexts";
import {
  IShippingAndBillingAddressShape,
  IShippingInfo,
  useGetShippingInfo,
} from "@hera/data";
import { Add as AddIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import {
  NesEmptyShippingAddress,
  NesShippingAddressItem,
} from "@nestle/components";
import {
  NesGuestSelectShippingAddressModal,
  NesShippingAddressModal,
} from "@nestle/ModalComponents";
import { useRouter } from "next/router";
import { FC, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

interface INesCheckoutShippingAddress {
  shippingAddress?: IShippingAndBillingAddressShape;
  isCartLoading?: boolean;
  onShippingAddressChange?: (data?: IShippingInfo) => void;
}

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

export const NesCheckoutShippingAddress: FC<INesCheckoutShippingAddress> = ({
  shippingAddress,
  isCartLoading,
  onShippingAddressChange,
}) => {
  const { push } = useRouter();
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [selected, setSeleted] = useState<IShippingInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGuestModalOpen, setOpenGuestModal] = useState<boolean>(false);
  const { isLogin } = useContext(AuthenticationContext);
  const { data: shippingAddresses = [], refetch: refetchShippingAddresses } =
    useGetShippingInfo(isLogin);

  const pageContent = {
    shippingAddress: formatMessage({ id: "checkoutPage.shippingAddress" }),
    create: formatMessage({ id: "checkoutPage.create" }),
    createNewShippingAddress: formatMessage({
      id: "checkoutPage.createNewShippingAddress",
    }),
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
        <Box
          sx={{
            px: 2,
            py: 2.5,
          }}
        >
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
                  <NesShippingAddressItem
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
            {pageContent.createNewShippingAddress}
          </Button>
          <NesShippingAddressModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => refetchShippingAddresses()}
            open={isModalOpen}
          />
        </Box>
      );
    }

    if (shippingAddress?.email?.includes("@")) {
      return (
        <Box
          sx={{
            px: 2,
            py: 2.5,
          }}
        >
          <Box mb={{ sm: 3, xs: 1.5 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              {pageContent.buyerInfo}
            </Typography>
            <Box pl={{ sm: 1.5, xs: 0.75 }}>
              {(shippingAddress?.firstName ||
                shippingAddress?.lastName ||
                shippingAddress?.displayName) && (
                <StyledBox>
                  <Typography variant="body1" sx={{ minWidth: 100 }}>
                    {`${pageContent.fullName}: `}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ ml: 0.5 }}>
                    {shippingAddress?.displayName ||
                      [shippingAddress?.firstName, shippingAddress?.lastName]
                        .filter(Boolean)
                        .join(" ")}
                  </Typography>
                </StyledBox>
              )}
              {shippingAddress?.phone && (
                <StyledBox>
                  <Typography variant="body1" sx={{ minWidth: 100 }}>
                    {`${pageContent.phone}: `}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ ml: 0.5 }}>
                    {shippingAddress?.phone}
                  </Typography>
                </StyledBox>
              )}
              {shippingAddress?.email && (
                <StyledBox>
                  <Typography variant="body1" sx={{ minWidth: 100 }}>
                    {`${pageContent.email}: `}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ ml: 0.5 }}>
                    {shippingAddress?.email}
                  </Typography>
                </StyledBox>
              )}
            </Box>
          </Box>
          <Box mb={{ sm: 3, xs: 1.5 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              {pageContent.addressInfo}
            </Typography>
            <Box pl={{ sm: 1.5, xs: 0.75 }}>
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
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
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => setOpenGuestModal(true)}
          >
            {pageContent.updateShippingAddress}
          </Button>
          <NesGuestSelectShippingAddressModal
            open={isGuestModalOpen}
            shippingAddress={shippingAddress}
            onSuccess={() => setOpenGuestModal(false)}
          />
        </Box>
      );
    }
    return (
      <>
        <NesEmptyShippingAddress
          onButtonClick={() => setOpenGuestModal(true)}
        />
        <NesGuestSelectShippingAddressModal
          open={isGuestModalOpen}
          shippingAddress={shippingAddress}
          onSuccess={() => setOpenGuestModal(false)}
        />
      </>
    );
  };

  return (
    <Box
      sx={{
        boxShadow: theme.shadows[2],
        borderRadius: 1.25,
      }}
    >
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          pt: 2,
        }}
      >
        <Typography variant="h6">{pageContent.shippingAddress}</Typography>
      </Box>
      <Divider />
      <Box>{renderContent()}</Box>
    </Box>
  );
};
