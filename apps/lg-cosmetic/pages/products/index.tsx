import { IPaginationQuery, useListBrands, useListProduct } from "@hera/data";
import { LcListProduct, LcSubscribeSection } from "@lc/components";
import { LcBreadcrumbs, LcFilter } from "@lc/LcProductsComponent";
import { IFilterParams } from "@lc/types";
import { Box } from "@mui/material";
import LcProductListLayout from "apps/lg-cosmetic/components/LcProductListLayout";
import { useState } from "react";

const Products = () => {
  const { data: brands } = useListBrands();
  const [filtersParams, setFiltersParams] = useState<object>({});
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [deleteAllFlag, setDeleteAllFlag] = useState<boolean>(false);
  const [queries, setQuery] = useState<IPaginationQuery>({ size: 20, page: 1 });

  const { data: response, isLoading } = useListProduct(filtersParams);

  const hadleSetFiterParams = (filters) => {
    const switchFiterParams = {};
    filters.map((data) => {
      if (data.dataFilter.length === 0) return;
      return (switchFiterParams[data.filterName] = data.dataFilter);
    });
    setFiltersParams(switchFiterParams);
    setOpenFilter(false);
  };

  const handleDeleteAllFilter = () => {
    setDeleteAllFlag(!deleteAllFlag);
    setFiltersParams({});
  };

  return (
    <LcProductListLayout setBanner={false}>
      <>
        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          <LcBreadcrumbs />
          <LcFilter
            onOpenFilter={() => setOpenFilter(!openFilter)}
            isOpen={openFilter}
            onSetFilterParams={hadleSetFiterParams}
            brands={brands}
            deleteAllFlag={deleteAllFlag}
            filtersParams={filtersParams as IFilterParams}
          />
        </Box>
        {/* <Box mb={2}>
          {Object.keys(filtersParams).length === 0 ? (
            <Box></Box>
          ) : (
            <LcChip
              brands={brands}
              filtersParams={filtersParams as IFilterParams}
              onDeleteAllFilter={handleDeleteAllFilter}
            />
          )}
        </Box> */}
        <LcListProduct
          products={response?.data || []}
          enablePagination
          isLoading={isLoading}
          pagination={response?.paginate}
          paginationProps={{
            onChange: (e, page) => {
              if (page === response?.paginate?.page) {
                return;
              }
              setQuery((current) => ({ ...current, page: page }));
              const newFilterPrams = { ...filtersParams, page: page };
              setFiltersParams(newFilterPrams);
            },
          }}
        />
        <Box mt={8}>
          <LcSubscribeSection />
        </Box>
      </>
    </LcProductListLayout>
  );
};

export default Products;
