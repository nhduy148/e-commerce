import {
  GSPProductOverviewContent,
  GSPProductOverviewImagesSlider,
} from "@gsp/components";
import { IProductDetail } from "@hera/data";
import { Grid, Skeleton } from "@mui/material";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";

interface IProps {
  productDetail: IProductDetail;
  isLoading: boolean;
  onRegisterGetSample?: (...args: any[]) => void;
}

const GSPProductOverviewComponent: FC<IProps> = ({
  productDetail: product,
  isLoading,
  onRegisterGetSample,
}) => {
  return (
    <Grid container mt={2.5} spacing={3}>
      <Grid item sm={6} xs={12}>
        <GSPProductOverviewImagesSlider
          product={product}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        {isLoading ? (
          <>
            <Skeleton animation="wave" variant="text" height={40} />
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height={160}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              width="30%"
              height={40}
            />
          </>
        ) : (
          <GSPProductOverviewContent
            product={product}
            onRegisterGetSample={onRegisterGetSample}
          />
        )}
      </Grid>
    </Grid>
  );
};

export const GSPProductOverview = memo(GSPProductOverviewComponent, isEqual);
