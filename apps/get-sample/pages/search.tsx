import { GSPListProduct } from "@gsp/components";
import { useBreakPoint } from "@gsp/hooks";
import { IPaginationQuery, useSearchProductsQuery } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function SearchPage() {
  const { __ } = useFormatter();
  const { query } = useRouter();
  const searchTerms = useMemo(() => query?.q?.toString() || "", [query.q]);
  const [queries, setQuery] = useState<IPaginationQuery>({ size: 20, page: 1 });
  const { data: products, isLoading } = useSearchProductsQuery({
    searchTerms,
    ...queries,
  });
  const isPC = useBreakPoint("sm");

  return (
    <Box pt={{ sm: 5, xs: 3 }} pb={{ sm: 10, xs: 5 }}>
      <Container>
        <Box py={{ xs: 3, sm: 5 }}>
          {products?.data?.length === 0 ? (
            <Typography variant="h6">
              {__({ defaultMessage: "Không có sản phẩm với từ khoá" })}{" "}
              <Typography
                variant={isPC ? "h4" : "h6"}
                color="primary"
                component="span"
              >
                {searchTerms}
              </Typography>
              {", "}
              {__({ defaultMessage: "vui lòng thử lại với từ khoá khác." })}
            </Typography>
          ) : (
            <Typography variant="h6">
              {__({ defaultMessage: "Kết quả tìm kiếm cho:" })}{" "}
              <Typography
                variant={isPC ? "h4" : "h6"}
                color="primary"
                component="span"
              >
                {searchTerms}
              </Typography>
            </Typography>
          )}
        </Box>
        <GSPListProduct
          products={products?.data || []}
          enablePagination
          isLoading={isLoading}
          pagination={products?.paginate}
          paginationProps={{
            onChange: (_, page) => {
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
