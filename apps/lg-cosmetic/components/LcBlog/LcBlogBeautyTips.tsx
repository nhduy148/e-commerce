import { IPageDataItem, useGetBlogListPost } from "@hera/data";
import { Box, Grid, Typography } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { BlogCard } from "./LcBlogCard";

interface Props {
  isPC: boolean;
  data: IPageDataItem;
}

const LcBlogBeautyTipsComponent = ({ isPC, data }: Props) => {
  const { formatMessage } = useIntl();
  const { data: listPost } = useGetBlogListPost({
    categoryId: data.id,
    size: 3,
  });
  return (
    <Box mt={isPC ? 5 : 2}>
      <Box
        sx={{
          backgroundColor: "error.50",
          borderRadius: "4px",
          mx: { xs: "-16px", sm: "0" },
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        <Typography variant="h4" fontStyle="italic" mb={1}>
          {data.name}
        </Typography>
        <Grid container spacing={2}>
          {listPost?.data?.length === 0 ? (
            <Box>{formatMessage({ id: "blogPage.noPost" })}</Box>
          ) : (
            listPost?.data?.map((post, index) => {
              return (
                <Grid key={index} item sm={4} xs={4}>
                  <BlogCard
                    postData={post}
                    tipName={data.name}
                    hiddenContent={true}
                    bgColor={"error.50"}
                    onBorder={false}
                  />
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export const LcBlogBeautyTips = memo(LcBlogBeautyTipsComponent, isEqual);
