import { IUserOrder } from "@hera/data";
import { formatDate, toCurrency } from "@hera/utils";
import {
  Add as AddIcon,
  OpenInNew as OpenInNewIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import {
  USER_ORDER_DAY_FORMAT,
  USER_ORDER_DAY_FORMAT_MOBILE,
} from "@nestle/constants";
import { useBreakPoint } from "@nestle/hooks";
import { useState } from "react";
import { useIntl } from "react-intl";
import { NesUserOrderProduct } from "./NesUserOrderProduct";

interface IUserOrderItemProps {
  panel: number;
  order: IUserOrder;
}

const UserOrdersItem = styled(Box)`
  display: flex;
  width: 100%;
`;

const UserOrdersAccordion = styled(Accordion)`
  background-color: ${({ theme }) => theme.palette.grey[50]};
  box-shadow: none;

  ::before {
    height: 0px;
  }
`;

const UserOrdersAccordionSummary = styled(AccordionSummary)`
  display: flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

const UserOrdersAccordionDetail = styled(AccordionDetails)`
  padding: 12px;
  border-top: none !important;
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
`;

const ClippedText = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const NesUserOrderItem: React.FunctionComponent<IUserOrderItemProps> = ({
  order,
  panel,
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isPC = useBreakPoint("sm");

  const pageContent = {
    onDelivery: formatMessage({ id: "userSetting.onDelivery" }),
    success: formatMessage({ id: "userSetting.success" }),
    order: formatMessage({ id: "userSetting.order" }),
    bol: formatMessage({ id: "userSetting.bol" }),
    deliveryService: formatMessage({ id: "userSetting.deliveryService" }),
    total: formatMessage({ id: "userSetting.total" }),
    address: formatMessage({ id: "userSetting.address" }),
    failed: formatMessage({ id: "userSetting.failed" }),
    verified: formatMessage({ id: "userSetting.verified" }),
    deliveryFee: formatMessage({ id: "userSetting.deliveryFee" }),
    statusPaymentProcessing: formatMessage({
      id: "userSetting.orderStatus.paymentProcessing",
    }),
    statusPaymentFailed: formatMessage({
      id: "userSetting.orderStatus.paymentFailed",
    }),
    statusPendingConfirm: formatMessage({
      id: "userSetting.orderStatus.pendingConfirm",
    }),
    statusConfirmed: formatMessage({
      id: "userSetting.orderStatus.confirmed",
    }),
    statusCancelled: formatMessage({
      id: "userSetting.orderStatus.cancelled",
    }),
    statusDlInTransit: formatMessage({
      id: "userSetting.orderStatus.dlInTransit",
    }),
    statusReturned: formatMessage({
      id: "userSetting.orderStatus.returned",
    }),
    statusCompleted: formatMessage({
      id: "userSetting.orderStatus.completed",
    }),
  };

  const statusChip = {
    payment_processing: {
      backgroundColor: theme.palette.warning.main,
      label: pageContent.statusPaymentProcessing,
    },
    payment_failed: {
      backgroundColor: theme.palette.error.main,
      label: pageContent.statusPaymentFailed,
    },
    pending_confirm: {
      backgroundColor: theme.palette.warning.main,
      label: pageContent.statusPendingConfirm,
    },
    confirmed: {
      backgroundColor: theme.palette.success.main,
      label: pageContent.statusConfirmed,
    },
    cancelled: {
      backgroundColor: theme.palette.error.main,
      label: pageContent.statusCancelled,
    },
    dl_intransit: {
      backgroundColor: theme.palette.warning.main,
      label: pageContent.statusDlInTransit,
    },
    returned: {
      backgroundColor: theme.palette.error.main,
      label: pageContent.statusReturned,
    },
    completed: {
      backgroundColor: theme.palette.success.main,
      label: pageContent.statusCompleted,
    },
  };

  const { addressLine1, ward, district, province } = order?.shippingAddress || {
    addressLine1: "",
    ward: "",
    district: "",
    province: "",
  };

  const address = [addressLine1, ward, district, province]
    .filter(Boolean)
    // @ts-ignore
    .map((part) => part?.name || part)
    .join(", ");

  const _renderBolLink = (deliveryService: string) => {
    switch (deliveryService) {
      case "giao-hang-tiet-kiem":
        return `https://i.ghtk.vn/`;
      case "giao-hang-nhanh":
        return `https://donhang.ghn.vn/?order_code=`;
      default:
        return;
    }
  };

  return (
    <UserOrdersAccordion
      disableGutters
      onChange={() => setExpanded((i) => (i === panel ? null : panel))}
      sx={{
        border: "1px solid",
        borderColor: theme.palette.grey[200],
        borderRadius: "6px",
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <UserOrdersAccordionSummary
        sx={{ m: 0 }}
        expandIcon={expanded === panel ? <RemoveIcon /> : <AddIcon />}
      >
        <UserOrdersItem
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            ".MuiAccordionSummary-expandIconWrapper": { ml: 2 },
          }}
        >
          <Box sx={{ flex: { sm: 20, xs: 15 } }}>
            <Typography variant="body2" color="grey.600">
              {formatDate(
                order?.completedAt,
                isPC ? USER_ORDER_DAY_FORMAT : USER_ORDER_DAY_FORMAT_MOBILE,
              )}
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: { sm: 3.5, xs: 1 },
              borderColor: theme.palette.grey[200],
            }}
          />

          <Box sx={{ flex: { sm: 20, xs: 15 } }}>
            <Typography variant="body1" color="text.main">
              {`ID-${order?.id}`}
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: { sm: 3.5, xs: 1 },
              borderColor: theme.palette.grey[200],
            }}
          />

          <Box
            display={{ sm: "block", xs: "none" }}
            sx={{ flex: { sm: 30, xs: 0 } }}
          >
            {toCurrency(order?.total)}
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: { sm: 3.5, xs: 1 },
              display: { sm: "block", xs: "none" },
              borderColor: theme.palette.grey[200],
            }}
          />
          <Box sx={{ flex: { sm: 20, xs: 70 } }}>
            {Object.keys(statusChip).includes(order?.state) && (
              <Chip
                size="small"
                label={statusChip[order?.state]?.label}
                sx={{
                  color: theme.palette.common.white,
                  backgroundColor: statusChip[order?.state]?.backgroundColor,
                }}
              />
            )}
          </Box>
        </UserOrdersItem>
      </UserOrdersAccordionSummary>
      <UserOrdersAccordionDetail>
        <Stack spacing={2}>
          <Box>
            <Box
              sx={{
                display: { md: "flex", xs: "block" },
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: { md: 0, xs: 1.5 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body2" color="grey.600">
                  {pageContent.order}:&nbsp;
                </Typography>
                <Typography variant="body2">{order?.number}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="grey.600">
                  {pageContent.bol}:&nbsp;
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ClippedText variant="body2">
                    {order?.packages[0]?.number}
                  </ClippedText>
                  <IconButton
                    href={`${_renderBolLink(
                      order?.packages[0]?.shippingMethod?.slug,
                    )}${order?.packages[0]?.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ ml: 0.5 }}
                  >
                    <OpenInNewIcon
                      sx={{
                        color: theme.palette.action.active,
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body2" color="grey.600">
                  {pageContent.deliveryService}:&nbsp;
                </Typography>
                <Typography variant="body2" textTransform="capitalize">
                  {order?.packages[0]?.shippingMethod?.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body2" color="grey.600">
                  {pageContent.deliveryFee}:&nbsp;
                </Typography>
                <Typography variant="body2" textTransform="capitalize">
                  {toCurrency(order?.packages[0]?.cost)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { sm: "flex", xs: "block" }, mt: 1 }}>
              <Typography variant="body2" color="grey.600">
                {pageContent.address}:&nbsp;
              </Typography>
              <Typography variant="body2">{address}</Typography>
            </Box>
          </Box>
          <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
            {order?.lineItems.map((item, index) => {
              return <NesUserOrderProduct key={index} item={item} />;
            })}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" color="text.main">
              {pageContent.total}
            </Typography>
            <Typography variant="subtitle1" color="text.main">
              {toCurrency(order?.total)}
            </Typography>
          </Box>
        </Stack>
      </UserOrdersAccordionDetail>
    </UserOrdersAccordion>
  );
};
