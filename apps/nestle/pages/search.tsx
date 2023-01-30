import { IPaginationQuery, useSearchProductsQuery } from "@hera/data";
import { Box, Container, Typography } from "@mui/material";
import { NesListProduct } from "@nestle/components";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function SearchPage() {
  const { query } = useRouter();
  const searchTerms = useMemo(() => query?.q?.toString() || "", [query.q]);
  const [queries, setQuery] = useState<IPaginationQuery>({ size: 20, page: 1 });
  const { data: products, isLoading } = useSearchProductsQuery({
    searchTerms,
    ...queries,
  });

  return (
    <Box pt={{ sm: 5, xs: 3 }} pb={{ sm: 10, xs: 5 }}>
      <Container>
        <Box py={{ xs: 3, sm: 5 }}>
          <Typography variant="h6">
            Kết quả tìm kiếm cho:{" "}
            <Typography variant="h5" color="primary" component="span">
              {searchTerms}
            </Typography>
          </Typography>
        </Box>
        <NesListProduct
          products={products?.data || []}
          enablePagination
          isLoading={isLoading}
          pagination={products?.paginate}
          paginationProps={{
            onChange: (e, page) => {
              if (page === products?.paginate?.page) {
                return;
              }
              setQuery((current) => ({ ...current, page: page }));
            },
          }}
        />
      </Container>
    </Box>
  );
}

export default SearchPage;
