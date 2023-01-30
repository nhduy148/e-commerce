import { IUserOrder } from "@hera/data";
import { formatDate, toCurrency } from "@hera/utils";
import { USER_ORDER_DAY_FORMAT } from "@lc/constants";
import {
  Add as AddIcon,
  Link as LinkIcon,
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
import { useState } from "react";
import { useIntl } from "react-intl";
import { LcUserOrderProduct } from "./LcUserOrderProduct";

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

export const LcUserOrderItem: React.FunctionComponent<IUserOrderItemProps> = ({
  order,
  panel,
}) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { formatMessage } = useIntl();
  const theme = useTheme();

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
      backgroundColor: theme.palette.warning[100],
      color: theme.palette.warning[500],
      label: pageContent.statusPaymentProcessing,
    },
    payment_failed: {
      backgroundColor: theme.palette.error[100],
      color: theme.palette.error[500],
      label: pageContent.statusPaymentFailed,
    },
    pending_confirm: {
      backgroundColor: theme.palette.warning[100],
      color: theme.palette.warning[500],
      label: pageContent.statusPendingConfirm,
    },
    confirmed: {
      backgroundColor: theme.palette.success[100],
      color: theme.palette.success[500],
      label: pageContent.statusConfirmed,
    },
    cancelled: {
      backgroundColor: theme.palette.error[100],
      color: theme.palette.error[500],
      label: pageContent.statusCancelled,
    },
    dl_intransit: {
      backgroundColor: theme.palette.warning[100],
      color: theme.palette.warning[500],
      label: pageContent.statusDlInTransit,
    },
    returned: {
      backgroundColor: theme.palette.error[100],
      color: theme.palette.error[500],
      label: pageContent.statusReturned,
    },
    completed: {
      backgroundColor: theme.palette.success[100],
      color: theme.palette.success[500],
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
      square={true}
      onChange={() => setExpanded((i) => (i === panel ? null : panel))}
    >
      <UserOrdersAccordionSummary
        expandIcon={expanded === panel ? <RemoveIcon /> : <AddIcon />}
      >
        <UserOrdersItem
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            ".MuiAccordionSummary-expandIconWrapper": { ml: 2 },
          }}
        >
          <Box sx={{ flex: 5 }} pr={1.5}>
            <Typography variant="body2" color="grey.600">
              {formatDate(order?.completedAt, USER_ORDER_DAY_FORMAT)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mr: 1.75 }} />

          <Box sx={{ flex: 55 }}>
            <Typography variant="body1" color="text.main">
              {`ID-${order?.id}`}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mr: 1.75 }} />

          <Box display={{ sm: "block", xs: "none" }} sx={{ flex: 30 }}>
            {toCurrency(order?.total)}
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mr: 1.75, display: { sm: "block", xs: "none" } }}
          />
          <Box sx={{ flex: 20 }}>
            {Object.keys(statusChip).includes(order?.state) && (
              <Chip
                label={statusChip[order?.state]?.label}
                sx={{
                  height: "22px",
                  backgroundColor: statusChip[order?.state]?.backgroundColor,
                  color: `${statusChip[order?.state]?.color} !important`,
                  fontSize: theme.typography.overline,
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
                alignItems: "center",
                mb: { md: 0, xs: 1.5 },
              }}
            >
              <Box display="flex">
                <Typography variant="body2" color="grey.600">
                  {pageContent.order}:&nbsp;
                </Typography>
                <Typography variant="body2">{order?.number}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" color="grey.600">
                  {pageContent.bol}:&nbsp;
                </Typography>
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
                  <LinkIcon color="secondary" />
                </IconButton>
              </Box>
              <Box display="flex">
                <Typography variant="body2" color="grey.600">
                  {pageContent.deliveryService}:&nbsp;
                </Typography>
                <Typography variant="body2" textTransform="capitalize">
                  {order?.packages[0]?.shippingMethod?.name}
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
              return <LcUserOrderProduct key={index} item={item} />;
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
