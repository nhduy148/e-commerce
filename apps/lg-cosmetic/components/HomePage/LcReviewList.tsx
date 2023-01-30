import { IPostItem } from "@hera/data";
import { LcReviewItem, LcSectionHeading } from "@lc/components";
import { Box, Grid, Skeleton, Stack } from "@mui/material";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";

interface IProps {
  heading: string;
  data: IPostItem[];
  isLoading?: boolean;
}

const LcHomeReviewListComponent: FC<IProps> = ({
  data,
  isLoading,
  heading,
}) => {
  const renderLoadingItem = (_, index: number) => {
    return (
      <Grid item sm={6} xs={12}>
        <Stack spacing={3} key={index}>
          <Skeleton width="100%" height={250} variant="rectangular" />
          <Skeleton width="100%" height={30} variant="text" />
          <Skeleton width="100%" height={60} variant="text" />
        </Stack>
      </Grid>
    );
  };

  return (
    <>
      <Box mb={7}>
        <LcSectionHeading text={heading} />
      </Box>
      <Grid container spacing={4}>
        {isLoading
          ? [...Array(2).keys()].map(renderLoadingItem)
          : data?.map((item, index) => (
              <Grid item sm={6} xs={12} key={index}>
                <LcReviewItem {...item} />
              </Grid>
            ))}
      </Grid>
    </>
  );
};

export const LcHomeReviewList = memo(LcHomeReviewListComponent, isEqual);
