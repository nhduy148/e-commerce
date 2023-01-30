import { LcProductSkeleton } from "@lc/components";
import { IItemPerBreakPoint } from "@lc/types";
import { itemPerBreakPoint } from "@lc/utils";
import { Grid } from "@mui/material";

interface IProps {
  total: number;
  responsive: IItemPerBreakPoint;
}

const LcLoadingProductComponent = (props: IProps) => {
  const responsiveItem = itemPerBreakPoint(props.responsive);
  return (
    <Grid container spacing={1}>
      {[...Array(props.total).keys()].map((_, index) => (
        <Grid item {...responsiveItem} key={index}>
          <LcProductSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

LcLoadingProductComponent.defaultProps = {
  total: 4,
  responsive: {
    lg: 4,
    md: 3,
    xs: 2,
  },
};

export const LcLoadingProduct = LcLoadingProductComponent;
