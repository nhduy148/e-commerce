import { IWishlistData, useRemoveWishlist } from "@hera/data";
import { Image } from "@hera/ui";
import { toCurrency } from "@hera/utils";
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
  useTheme,
} from "@mui/material";
import { useAddToCart } from "@nestle/hooks";
import Link from "next/link";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useIntl } from "react-intl";

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

export const NesUserWishlistItem: React.FunctionComponent<
  IUserWishlistItem
> = ({ data, refetchWishlist }) => {
  const { mutate, isSuccess: removeSuccess } = useRemoveWishlist();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const _handleAddToCart = useAddToCart();
  const theme = useTheme();

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
      {
        quantity: 1,
        productId: data.productId,
      },
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
        <Grid lg={4} xs={10} item sx={{ display: "flex" }}>
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
                  <ClippedText typography="body1">
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
              <Typography variant="subtitle1" color="text.primary">
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
          <Typography variant="subtitle1">
            {toCurrency(data.product?.sellingPrice)}
          </Typography>
        </Grid>

        <Grid
          lg={6}
          xs={12}
          item
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            sx={{
              mr: 1,
            }}
            color="primary"
            variant="outlined"
            startIcon={<AddShoppingCartIcon />}
            disabled={isAdding || isRemoving}
            onClick={handleAddToCart}
            size="medium"
          >
            {isAdding ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              formatMessage({ id: "userSetting.addToCart" })
            )}
          </Button>

          <Button
            color="primary"
            variant="outlined"
            size="medium"
            startIcon={<FavoriteIcon color="inherit" />}
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
