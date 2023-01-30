import { GSPLoadingButton } from "@gsp/components";
import { IProductDetail } from "@hera/data";
import { Box, Divider, Grid, Icon, Typography, useTheme } from "@mui/material";
import { FC } from "react";

import { useBreakPoint } from "@gsp/hooks";
import { useFormatter } from "@hera/i18n";
interface IProps {
  product: IProductDetail;
  onRegisterGetSample?: (...args: any[]) => void;
}

export const GSPProductOverviewContent: FC<IProps> = ({
  product,
  onRegisterGetSample,
}) => {
  const { __ } = useFormatter();
  const theme = useTheme();
  const isPC = useBreakPoint("sm");

  return (
    <>
      <Box sx={{ marginBottom: 2.25 }}>
        <Typography variant="h4" sx={{ marginBottom: 2.25 }}>
          {product?.name}
        </Typography>

        <Grid
          container
          rowGap={1}
          sx={[
            { color: theme.palette.grey[500] },
            {
              ".MuiGrid-item:nth-child(2) .MuiDivider-root": {
                display: { sm: "block", xs: "none" },
              },
            },
          ]}
        >
          {product?.brand?.name && (
            <>
              <Grid item sm="auto" xs={6} display="flex">
                <Typography variant="body1">
                  {__({ defaultMessage: "Thương hiệu" })}:{" "}
                  {product?.brand?.name}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
              </Grid>
            </>
          )}
          {product?.taxons[0]?.name && (
            <>
              <Grid item sm="auto" xs={6} display="flex">
                <Typography variant="body1">
                  {__({ defaultMessage: "Danh mục" })}:{" "}
                  {product?.taxons[0]?.name}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
              </Grid>
            </>
          )}
          {product?.sku && (
            <Grid item sm="auto" xs={6}>
              <Typography variant="body1">
                {__({ defaultMessage: "SKU" })}: {product?.sku}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Divider />

      <Box>
        <Box sx={{ marginTop: 2.25 }}>
          <Typography variant="body1">{product?.shortDescription}</Typography>
        </Box>

        <Box
          mt={2}
          sx={{ display: { xs: "block", sm: "flex" } }}
          alignItems="center"
        >
          <>
            <GSPLoadingButton
              size="large"
              variant="contained"
              fullWidth={!isPC}
              onClick={onRegisterGetSample}
              endIcon={
                <Icon>
                  {product.inStock <= 0
                    ? "sentiment_very_dissatisfied"
                    : "arrow_forward"}
                </Icon>
              }
              disabled={product.inStock <= 0}
            >
              {product.inStock <= 0
                ? __({ defaultMessage: "Hàng đang về" })
                : __({ defaultMessage: "Đăng kí dùng thử" })}
            </GSPLoadingButton>
          </>
        </Box>
      </Box>
    </>
  );
};
