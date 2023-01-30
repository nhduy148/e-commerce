import { GSPProductSkeleton } from "@gsp/components";
import { IItemPerBreakPoint } from "@gsp/types";
import { itemPerBreakPoint } from "@gsp/utils";
import { Grid } from "@mui/material";

interface IProps {
  total: number;
  responsive: IItemPerBreakPoint;
}

const GSPLoadingProduct = (props: IProps) => {
  const responsiveItem = itemPerBreakPoint(props.responsive);
  return (
    <Grid container spacing={{ sm: 3, xs: 2 }}>
      {[...Array(props.total).keys()].map((_, index) => (
        <Grid item {...responsiveItem} key={index}>
          <GSPProductSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

GSPLoadingProduct.defaultProps = {
  total: 4,
  responsive: {
    md: 4,
    sm: 3,
    xs: 2,
  },
};

export { GSPLoadingProduct };
