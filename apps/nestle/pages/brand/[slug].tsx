import { useDetailBrand, useListProduct } from "@hera/data";
import { Banner } from "@hera/ui";
import { Box, Typography, useTheme } from "@mui/material";
import { NesListProduct } from "@nestle/components";
import { useBreakPoint } from "@nestle/hooks";
import NesProductListLayout from "apps/nestle/components/NesProductListLayout";
import { NesBreadcrumbs } from "apps/nestle/components/NesProducts";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useIntl } from "react-intl";

const CategoryProducts = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isPC = useBreakPoint("sm");
  const router = useRouter();
  const brandSlug = router.query.slug as string;
  const { data: brandsData, status } = useDetailBrand(brandSlug);
  const [filtersParams, setFiltersParams] = useState({});

  const { data: response, isLoading: listProductLoading } = useListProduct({
    ...filtersParams,
    size: 20,
  });

  useLayoutEffect(() => {
    setFiltersParams({ brandIds: [brandsData?.id] });
  }, [brandsData]);

  useEffect(() => {
    if (status === "error") {
      router.push("/404");
    }
  }, []);

  return (
    <NesProductListLayout>
      <>
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          <NesBreadcrumbs
            brandName={brandsData?.name}
            loading={listProductLoading}
          />
        </Box>
        <Box mt={2}>
          <Box display="flex" justifyContent={isPC ? "center" : "flex-start"}>
            <Typography variant={isPC ? "h4" : "h6"} color="primary.main">
              <b>{brandsData?.name}</b>
            </Typography>
          </Box>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            ></Box>
            <Box mt={isPC ? "32px" : "0px"}>
              <Banner
                ratio={{ x: 20, y: isPC ? 4.7 : 10 }}
                //@ts-ignore
                source={brandsData}
                imageOptions={{ objectFit: "cover" }}
              />
            </Box>
          </Box>
          <Box mt={4}>
            <NesListProduct
              products={response?.data || []}
              enablePagination
              isLoading={listProductLoading}
              showEmptyText
              emptyText={formatMessage({ id: "productDetail.noProducts" })}
              layout={{
                md: 3,
                xs: 2,
              }}
              pagination={response?.paginate}
              paginationProps={{
                onChange: (e, page) => {
                  if (page === response?.paginate?.page) {
                    return;
                  }

                  setFiltersParams({
                    ...filtersParams,
                    page: page,
                  });
                },
              }}
            />
          </Box>
        </Box>
      </>
    </NesProductListLayout>
  );
};

export default CategoryProducts;
