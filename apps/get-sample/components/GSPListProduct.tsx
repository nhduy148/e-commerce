import {
  GSPListBanner,
  GSPLoadingProduct,
  GSPProductItem,
  GSPSectionHeading,
} from "@gsp/components";
import { WRAPPER_PRODUCT_ITEM_SPACING } from "@gsp/constants";
import { useBreakPoint } from "@gsp/hooks";
import { IItemPerBreakPoint } from "@gsp/types";
import { itemPerBreakPoint } from "@gsp/utils";
import { IMainBanner, IPaginate, IProduct } from "@hera/data";
import {
  Box,
  BoxProps,
  Button,
  Grid,
  Icon,
  Pagination,
  PaginationProps,
  Typography,
} from "@mui/material";
import { FC } from "react";

interface IGSPListProductProps extends BoxProps {
  showHeading?: boolean;
  heading?: string;
  products: IProduct[];
  pagination?: IPaginate;
  banners?: IMainBanner[];
  emptyText?: string;
  enablePagination?: boolean;
  enableShowMoreButton?: boolean;
  showMoreButtonText?: string;
  onShowMoreButtonClick?: (e?: any) => void;
  isLoading?: boolean;
  layout?: IItemPerBreakPoint;
  paginationProps?: PaginationProps;
  showEmptyText?: boolean;
}

const GSPListProductComponent: FC<IGSPListProductProps> = ({
  showHeading,
  heading,
  banners,
  products,
  pagination,
  enablePagination,
  enableShowMoreButton,
  showMoreButtonText,
  emptyText,
  isLoading,
  layout,
  paginationProps,
  onShowMoreButtonClick,
  showEmptyText,
}) => {
  const isPC = useBreakPoint("sm");
  const responsiveItem = layout ? itemPerBreakPoint(layout) : { md: 3, xs: 6 };
  const page = pagination?.page || 1;
  const total = pagination?.total || 1;
  const size = pagination?.size || 1;
  const totalPages = Math.ceil(total / size);
  const getSpacing = () => {
    if (!isPC) {
      return 2;
    }
    return responsiveItem?.["md"] === 4 ? 4 : 3;
  };

  const renderEmpty = showEmptyText ? (
    <Typography variant="subtitle1">{emptyText}</Typography>
  ) : null;

  return (
    <Box>
      {showHeading && heading.length > 0 && (
        <Box mb={5}>
          <GSPSectionHeading text={heading} />
        </Box>
      )}
      <GSPListBanner banners={banners} sx={{ mb: 3 }} />
      <Box mx={-(WRAPPER_PRODUCT_ITEM_SPACING / 8)}>
        {isLoading ? (
          <GSPLoadingProduct total={4} />
        ) : products?.length > 0 ? (
          <>
            <Grid container spacing={getSpacing()}>
              {products?.map((product, index) => (
                <Grid item {...responsiveItem} key={index}>
                  <GSPProductItem product={product} />
                </Grid>
              ))}
            </Grid>
            {enableShowMoreButton && pagination?.hasNext && !enablePagination && (
              <Box mt={3} textAlign="center">
                <Button
                  variant="text"
                  onClick={(e) => {
                    if (typeof onShowMoreButtonClick === "function") {
                      onShowMoreButtonClick(e);
                    }
                  }}
                  endIcon={<Icon fontSize="inherit">arrow_forward</Icon>}
                >
                  {showMoreButtonText}
                </Button>
              </Box>
            )}
            {enablePagination && totalPages > 1 && (
              <Pagination
                sx={{
                  mt: 5,
                  "& .MuiPagination-ul": {
                    justifyContent: "center",
                  },
                }}
                {...paginationProps}
                shape="rounded"
                count={totalPages}
                page={page}
                boundaryCount={paginationProps?.boundaryCount || 2}
              />
            )}
          </>
        ) : (
          renderEmpty
        )}
      </Box>
    </Box>
  );
};

GSPListProductComponent.defaultProps = {
  emptyText: "Không có sản phẩm nào",
  showMoreButtonText: "Xem thêm",
  enableShowMoreButton: false,
  enablePagination: false,
  isLoading: false,
};

export { GSPListProductComponent as GSPListProduct };
