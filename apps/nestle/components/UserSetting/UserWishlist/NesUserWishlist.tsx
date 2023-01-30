import { AuthenticationContext } from "@hera/contexts";
import { useUserWishlist } from "@hera/data";
import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { NesUserPagination } from "../NesUserPagination";
import { NesUserEmptyWishlist } from "./NesUserEmptyWishlist";
import { NesUserWishlistItem } from "./NesUserWishlistItem";

const PAGE_SIZE = 4;

export const NesUserWishlist: React.FunctionComponent = () => {
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
    size: PAGE_SIZE,
  });

  useEffect(() => {
    if (wishlistData?.data.length === 0 && wishlistData?.paginate.page > 1) {
      setPage(wishlistData?.paginate.page - 1);
    }
  }, [wishlistData?.data]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
        }}
      >
        <Typography variant="h6" color="text.main">
          {pageContent.favorites}
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
        <Stack spacing={3}>
          {wishlistData?.data.length > 0 && (
            <>
              <Typography variant="body2" color="grey.600">
                {formatMessage(
                  { id: "userSetting.nowHave" },
                  { quantity: wishlistData?.paginate.total },
                )}
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
            </>
          )}
          {userWishlistLoading ? (
            <CircularProgress size={50} />
          ) : (
            <Box sx={{ alignItems: "center" }}>
              {wishlistData?.data.length > 0 ? (
                wishlistData?.data.map((data) => {
                  return (
                    <NesUserWishlistItem
                      key={data.productId}
                      data={data}
                      refetchWishlist={refetch}
                    />
                  );
                })
              ) : (
                <Box>
                  <NesUserEmptyWishlist />
                </Box>
              )}
            </Box>
          )}
          {wishlistData?.paginate.total > PAGE_SIZE && (
            <NesUserPagination
              page={page}
              onSetPage={setPage}
              count={wishlistData?.paginate.totalPages}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
};
