import {
  GET_JUST_FOR_YOU,
  IWishlistData,
  useRemoveWishlist,
  USER_WISHLIST,
} from "@hera/data";
import { Image } from "@hera/ui";
import { toCurrency } from "@hera/utils";
import { useAddToCart } from "@lc/hooks";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link as MuiLink,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";

interface IUserWishlistItem {
  data: IWishlistData;
  refetchWishlist: () => void;
}

const ClippedText = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const LcUserWishlistItem: React.FunctionComponent<IUserWishlistItem> = ({
  data,
  refetchWishlist,
}) => {
  const { mutate, isSuccess: removeSuccess } = useRemoveWishlist();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const _handleAddToCart = useAddToCart();
  const queryClient = useQueryClient();

  const handleRemoveWishlistItem = (id: number, productName: string) => {
    setIsRemoving(true);
    mutate(
      { id },
      {
        onSuccess: () => {
          enqueueSnackbar(formatMessage({ id: "wishlist.removeSuccess" }), {
            variant: "success",
          });
          refetchWishlist();
          setIsRemoving(false);
          queryClient.fetchQuery(GET_JUST_FOR_YOU);
          queryClient.fetchQuery([USER_WISHLIST, {}]);
        },
        onError: () => {
          enqueueSnackbar(formatMessage({ id: "wishlist.removeFailure" }), {
            variant: "error",
          });
        },
      },
    );
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    setIsAdding(true);
    _handleAddToCart(
      { quantity: 1, product: data?.product },
      { finallyCallback: () => setIsAdding(false) },
    );
  };

  return (
    <Box>
      <Grid
        container
        spacing={{ xs: 1 }}
        sx={{ justifyContent: "space-between" }}
      >
        <Grid lg={5} xs={10} item sx={{ display: "flex" }}>
          <Image
            src={
              data.product?.images.find((image) => image.isDefault === true)
                ?.thumb
            }
            alt={data.product?.name}
            height={60}
            width={60}
            style={{ flex: 2 }}
          />

          <Box sx={{ ml: 3, flex: 8 }}>
            <Link href={`/products/${data.product?.slug}`} passHref>
              <MuiLink color="grey.900" underline="hover">
                <Tooltip title={data.product.name}>
                  <ClippedText typography="body2">
                    {data.product?.name}
                  </ClippedText>
                </Tooltip>
              </MuiLink>
            </Link>
            <Box
              sx={{
                display: { sm: "none", xs: "block" },
              }}
            >
              <Typography variant="h6">
                {toCurrency(data.product?.sellingPrice)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid
          lg={2}
          item
          sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center" }}
        >
          <Typography variant="h6">
            {toCurrency(data.product?.sellingPrice)}
          </Typography>
        </Grid>

        <Grid
          lg={5}
          xs={12}
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            sx={{ mr: 2 }}
            startIcon={<AddShoppingCartIcon />}
            size="small"
            fullWidth
            disabled={isAdding || isRemoving}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              formatMessage({ id: "userSetting.addToCart" })
            )}
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<FavoriteIcon color="primary" />}
            size="small"
            sx={{ width: "70%" }}
            onClick={() =>
              handleRemoveWishlistItem(data.productId, data.product.name)
            }
            disabled={isRemoving || isAdding}
          >
            {isRemoving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              formatMessage({ id: "userSetting.unlike" })
            )}
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};
