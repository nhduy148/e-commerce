import React, { useState } from "react";

import { useUserOrders } from "@hera/data";

import { USER_ACCOUNT_PAGE_SIZE } from "@lc/constants";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { LcUserPagination } from "../LcUserPagination";
import { LcUserEmptyOrders } from "./LcUserEmptyOrders";
import { LcUserOrderItem } from "./LcUserOrderItem";

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

export const LcUserOrders: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(1);

  const {
    data: userOrders,
    isSuccess: getUserOrdersSuccess,
    refetch,
    isLoading,
  } = useUserOrders({ page, size: USER_ACCOUNT_PAGE_SIZE });

  return (
    <SettingMenuPaper elevation={3} sx={{ p: { xs: 2 } }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h5"
          color="inherit"
          textTransform="uppercase"
          sx={{ mb: 3 }}
        >
          {formatMessage({ id: "userSetting.ordersHistory" })}
        </Typography>

        {isLoading ? (
          <CircularProgress size={50} />
        ) : (
          <Stack spacing={2} mb={2}>
            {userOrders?.data.length > 0 ? (
              userOrders?.data.map((orderData, index) => (
                <LcUserOrderItem panel={index} order={orderData} key={index} />
              ))
            ) : (
              <LcUserEmptyOrders />
            )}
          </Stack>
        )}

        {userOrders?.paginate.total > USER_ACCOUNT_PAGE_SIZE && (
          <LcUserPagination
            page={page}
            onSetPage={setPage}
            count={userOrders?.paginate.totalPages}
          />
        )}
      </Box>
    </SettingMenuPaper>
  );
};
