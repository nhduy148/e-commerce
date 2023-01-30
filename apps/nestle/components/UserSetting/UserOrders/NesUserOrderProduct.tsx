import { IUserOrderLineItem } from "@hera/data";
import { toCurrency } from "@hera/utils";
import {
  Box,
  Grid,
  Link as MuiLink,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";

interface IUserOrderProduct {
  item: IUserOrderLineItem;
}

import { Image } from "@hera/ui";

const ClippedText = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const NesUserOrderProduct: React.FunctionComponent<
  IUserOrderProduct
> = ({ item }) => {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
      wrap="nowrap"
    >
      <Grid item sm={6} xs={12} sx={{ display: "flex" }}>
        <Box
          flex={20}
          sx={{
            img: {
              borderRadius: "6px",
            },
          }}
        >
          <Image
            src={
              item.product.images.find((image) => image.isDefault === true)
                ?.thumb
            }
            alt={item.product.name}
            height={60}
            width={60}
          />
        </Box>
        <Box flex={80} ml={3}>
          <Link href={`/products/${item.product.slug}`} passHref>
            <MuiLink color="grey.900" underline="hover">
              <Tooltip title={item?.product.name}>
                <ClippedText variant="body2">{item.product.name}</ClippedText>
              </Tooltip>
            </MuiLink>
          </Link>
          <Typography variant="body2" color="grey.600">
            {toCurrency(item.product.sellingPrice)}
          </Typography>
          <Typography
            variant="body2"
            display={{ sm: "none", xs: "block" }}
          >{`x${item.quantity}`}</Typography>
        </Box>
      </Grid>

      <Grid
        item
        display={{ sm: "flex", xs: "none" }}
        justifyContent="center"
        sm={3}
      >
        <Typography variant="body1">{`x${item.quantity}`}</Typography>
      </Grid>

      <Grid
        item
        display={{ sm: "flex", xs: "none" }}
        justifyContent="flex-end"
        sm={3}
      >
        <Typography variant="body1">{toCurrency(item.totalPrice)}</Typography>
      </Grid>
    </Grid>
  );
};
