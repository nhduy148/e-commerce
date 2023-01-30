import { IMainBanner, IPaginate, IProduct } from "@hera/data";
import {
  LcBannerBlock,
  LcLoadingProduct,
  LcProductItem,
  LcSectionHeading,
} from "@lc/components";
import { IItemPerBreakPoint } from "@lc/types";
import { itemPerBreakPoint } from "@lc/utils";
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
import { useRouter } from "next/router";
import { FC } from "react";

interface ILcListProductProps extends BoxProps {
  heading?: string;
  products: IProduct[];
  pagination?: IPaginate;
  emptyText?: string;
  banners?: IMainBanner[];
  enablePagination?: boolean;
  enableShowMoreButton?: boolean;
  showMoreButtonText?: string;
  isLoading?: boolean;
  layout?: IItemPerBreakPoint;
  paginationProps?: PaginationProps;
  collectionSlug?: string;
  showHeading?: boolean;
}

const LcListProductComponent: FC<ILcListProductProps> = ({
  heading,
  products,
  pagination,
  enablePagination,
  enableShowMoreButton,
  showMoreButtonText,
  emptyText,
  isLoading,
  layout,
  banners,
  paginationProps,
  collectionSlug,
  showHeading,
}) => {
  const router = useRouter();
  const responsiveItem = itemPerBreakPoint(layout);
  const page = pagination?.page || 1;
  const total = pagination?.total || 1;
  const size = pagination?.size || 1;

  const totalPages = Math.ceil(total / size);
  return (
    <>
      {showHeading && (
        <Box mb={{ sm: 7.5, xs: 3 }}>
          <LcSectionHeading text={heading} />
        </Box>
      )}
      <Box>
        <LcBannerBlock banners={banners} />
      </Box>
      <Box mb={5}>
        {isLoading ? (
          <LcLoadingProduct total={4} {...responsiveItem} />
        ) : products?.length ? (
          <Grid container spacing={2}>
            {products?.map((x, index) => (
              <Grid item {...responsiveItem} key={index}>
                <LcProductItem product={x} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="subtitle1">{emptyText}</Typography>
        )}
      </Box>
      {enableShowMoreButton && pagination?.hasNext && !enablePagination && (
        <Box mt={3} textAlign="center">
          <Button
            variant="text"
            onClick={() =>
              router.push(
                collectionSlug.length === 0
                  ? `${router.asPath}`
                  : `/collections/${collectionSlug}`,
              )
            }
            endIcon={<Icon fontSize="inherit">arrow_forward</Icon>}
          >
            {showMoreButtonText}
          </Button>
        </Box>
      )}
      {enablePagination && totalPages > 1 && (
        <Pagination
          sx={{
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
  );
};

LcListProductComponent.defaultProps = {
  emptyText: "Không có sản phẩm nào",
  showMoreButtonText: "Xem thêm",
  enableShowMoreButton: false,
  enablePagination: false,
  isLoading: false,
  showHeading: true,
  layout: {
    lg: 4,
    md: 3,
    xs: 2,
  },
};

export const LcListProduct = LcListProductComponent;
