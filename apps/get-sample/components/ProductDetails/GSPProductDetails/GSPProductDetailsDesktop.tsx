import {
  GSPProductDetailsDashBoard,
  GSPProductDetailsDescriptions,
  IProductDetailsProps,
} from "@gsp/components";
import { useFormatter } from "@hera/i18n";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { FC } from "react";

export const GSPProductDetailsDesktop: FC<IProductDetailsProps> = ({
  productDetail,
  isLoading,
}) => {
  const { __ } = useFormatter();

  return (
    <Grid container mt={5.5} spacing={3}>
      <Grid item sm={8}>
        {isLoading ? (
          <>
            <Skeleton
              width={100}
              height={40}
              animation="wave"
              sx={{ marginBottom: 3 }}
            />
            <Skeleton
              width="100%"
              height={500}
              animation="wave"
              variant="rounded"
            />
          </>
        ) : (
          <>
            <Box mb={3}>
              <Typography variant="h4" color="text.main">
                {__({ defaultMessage: "Mô tả" })}
              </Typography>
            </Box>
            <GSPProductDetailsDescriptions
              description={productDetail?.description}
            />
          </>
        )}
      </Grid>
      <Grid item sm={4}>
        <GSPProductDetailsDashBoard
          productDetail={productDetail}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
};
