import { IPageDataItem, useGetBlogListPost } from "@hera/data";
import { Box, Grid, Typography } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { BlogSubCard } from "./LcBlogSubCard";

interface Props {
  isPC: boolean;
  data: IPageDataItem;
}

const LcBlogLiveStyleComponent = ({ isPC, data }: Props) => {
  const { formatMessage } = useIntl();
  const { data: listPost } = useGetBlogListPost({
    categoryId: data.id,
    size: 3,
  });
  return (
    <Box mt={isPC ? 5 : 2}>
      <Grid container spacing={3}>
        <Grid item sm={9}>
          <Box
            sx={{
              px: { xs: 0, sm: 3 },
              py: 3,
            }}
          >
            <Typography variant="h4" fontStyle="italic" mb={1}>
              {data.name}
            </Typography>
            <Box>
              {listPost?.data?.length === 0 ? (
                <Box>{formatMessage({ id: "blogPage.noPost" })}</Box>
              ) : (
                listPost?.data?.map((post, index) => {
                  return (
                    <Box py={2} borderBottom="1px solid" borderColor="grey.500">
                      <BlogSubCard
                        tipName={data.name}
                        postData={post}
                        onBorder={isPC ? true : false}
                        hiddenContent={false}
                        layoutLeft={{ sm: 3, xs: 5 }}
                        layoutRight={{ sm: 9, xs: 7 }}
                        imageMaxHeight={"100px"}
                      />
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export const LcBlogLiveStyle = memo(LcBlogLiveStyleComponent, isEqual);
