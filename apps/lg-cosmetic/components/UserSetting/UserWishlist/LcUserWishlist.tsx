import { AuthenticationContext } from "@hera/contexts";
import { useUserWishlist } from "@hera/data";
import { USER_ACCOUNT_PAGE_SIZE } from "@lc/constants";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { LcUserPagination } from "../LcUserPagination";
import { LcUserEmptyWishlist } from "./LcUserEmptyWishlist";
import { LcUserWishlistItem } from "./LcUserWishlistItem";

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

export const LcUserWishlist: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();
  const authen = useContext(AuthenticationContext);
  const pageContent = {
    favorites: formatMessage({ id: "userSetting.favorites" }),
    addToCart: formatMessage({ id: "userSetting.addToCart" }),
    unlike: formatMessage({ id: "userSetting.unlike" }),
    products: formatMessage({ id: "userSetting.products" }),
    emptyList: formatMessage({ id: "userSetting.emptyList" }),
  };

  const [page, setPage] = useState(1);

  const {
    data: wishlistData,
    refetch,
    isLoading: userWishlistLoading,
  } = useUserWishlist(authen.isLogin, {
    page: page,
    size: USER_ACCOUNT_PAGE_SIZE,
  });

  useEffect(() => {
    if (wishlistData?.data.length === 0 && wishlistData?.paginate.page > 1) {
      setPage(wishlistData?.paginate.page - 1);
    }
  }, [wishlistData?.data]);

  return (
    <SettingMenuPaper elevation={3} sx={{ p: { xs: 2 } }}>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h5"
          color="inherit"
          textTransform="uppercase"
          sx={{ mb: 3 }}
        >
          {pageContent.favorites}
        </Typography>
        <Stack spacing={3}>
          {wishlistData?.data.length > 0 && (
            <Typography variant="body2" color="grey.600">
              {formatMessage(
                { id: "userSetting.nowHave" },
                { quantity: wishlistData?.paginate.total },
              )}
            </Typography>
          )}
          {userWishlistLoading ? (
            <CircularProgress size={50} />
          ) : (
            <Box sx={{ alignItems: "center" }}>
              {wishlistData?.data.length > 0 ? (
                wishlistData?.data.map((data) => {
                  return (
                    <LcUserWishlistItem
                      key={data.productId}
                      data={data}
                      refetchWishlist={refetch}
                    />
                  );
                })
              ) : (
                <Box>
                  <LcUserEmptyWishlist />
                </Box>
              )}
            </Box>
          )}
          {wishlistData?.paginate.total > USER_ACCOUNT_PAGE_SIZE && (
            <LcUserPagination
              page={page}
              onSetPage={setPage}
              count={wishlistData?.paginate.totalPages}
            />
          )}
        </Stack>
      </Box>
    </SettingMenuPaper>
  );
};
