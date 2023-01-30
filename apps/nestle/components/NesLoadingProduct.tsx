import { Grid } from "@mui/material";
import { NesProductSkeleton } from "@nestle/components";
import { IItemPerBreakPoint } from "@nestle/types";
import { itemPerBreakPoint } from "@nestle/utils";

interface IProps {
  total: number;
  responsive: IItemPerBreakPoint;
}

const NesLoadingProduct = (props: IProps) => {
  const responsiveItem = itemPerBreakPoint(props.responsive);
  return (
    <Grid container spacing={{ sm: 3, xs: 2 }}>
      {[...Array(props.total).keys()].map((_, index) => (
        <Grid item {...responsiveItem} key={index}>
          <NesProductSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

NesLoadingProduct.defaultProps = {
  total: 4,
  responsive: {
    md: 4,
    sm: 3,
    xs: 2,
  },
};

export { NesLoadingProduct };
