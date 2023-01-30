import React, { useState } from "react";

import { useUserOrders } from "@hera/data";

import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { NesUserPagination } from "../NesUserPagination";
import { NesUserEmptyOrders } from "./NesUserEmptyOrders";
import { NesUserOrderItem } from "./NesUserOrderItem";

const PAGE_SIZE = 4;

export const NesUserOrders: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(1);

  const {
    data: userOrders,
    isSuccess: getUserOrdersSuccess,
    refetch,
    isLoading,
  } = useUserOrders({ page, size: PAGE_SIZE });

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
        }}
      >
        <Typography variant="h6" color="inherit">
          {formatMessage({ id: "userSetting.ordersHistory" })}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 1.5,
        }}
      >
        {isLoading ? (
          <CircularProgress size={50} />
        ) : (
          <Stack spacing={2} mb={2}>
            {userOrders?.data.length > 0 ? (
              userOrders?.data.map((orderData, index) => (
                <NesUserOrderItem panel={index} order={orderData} key={index} />
              ))
            ) : (
              <NesUserEmptyOrders />
            )}
          </Stack>
        )}

        {userOrders?.paginate.total > PAGE_SIZE && (
          <NesUserPagination
            page={page}
            onSetPage={setPage}
            count={userOrders?.paginate.totalPages}
          />
        )}
      </Box>
    </Box>
  );
};
