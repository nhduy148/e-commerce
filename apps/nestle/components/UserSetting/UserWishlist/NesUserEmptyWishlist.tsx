import { Box, Button, Typography } from "@mui/material";
import { NesEmptyWishlist } from "@nestle/static/images";
import Image from "next/image";
import router from "next/router";
import { useIntl } from "react-intl";

type Props = {};

export const NesUserEmptyWishlist = (props: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        my: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image
        height={174}
        width={174}
        src={NesEmptyWishlist.src}
        alt="Empty Wishlist"
      />
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="h5" color="primary.main">
          {formatMessage({ id: "userSetting.noWishlistProducts" })}
        </Typography>
        <Typography variant="body1">
          {formatMessage({ id: "userSetting.noWishlistProductsDesc" })}
        </Typography>
      </Box>
      <Button
        color="primary"
        variant="contained"
        sx={{ mt: 3 }}
        size="large"
        onClick={() => router.push("/products")}
      >
        {formatMessage({ id: "userSetting.noWishlistProductsAction" })}
      </Button>
    </Box>
  );
};
