import {
  GET_DETAIL_PRODUCT_QUERY,
  Product,
  useGetProductDetail,
} from "@hera/data";
import { Box, Container } from "@mui/material";
import {
  NesProductDetailBreadcrumbs,
  NesProductDetailContent,
  NesProductDetailInfo,
  NesRelatedProduct,
} from "apps/nestle/components/NesProductDetail";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";

const ProductDetails = () => {
  const router = useRouter();
  const {
    data: productDetail,
    refetch: productDetailRefetch,
    status,
  } = useGetProductDetail(router.query.slug as string);

  useEffect(() => {
    if (status === "error") {
      router.push("/404");
    }
  }, []);

  return (
    <Box minHeight="100vh">
      <Container>
        <Box mt={3.5}>
          {productDetail && (
            <>
              <NesProductDetailBreadcrumbs
                breadcrumbList={productDetail?.breadcrumbs}
              />
              <NesProductDetailInfo
                productDetail={productDetail}
                productDetailRefetch={productDetailRefetch}
              />
              <NesProductDetailContent
                productDetail={productDetail}
                productDetailRefetch={productDetailRefetch}
              />
              <NesRelatedProduct productId={productDetail?.id} />
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export async function getStaticProps(context) {
  const { params } = context;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [GET_DETAIL_PRODUCT_QUERY, params.slug],
    queryFn() {
      return Product.getProductDetails(params.slug);
    },
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths(context) {
  return {
    paths: [],
    fallback: true,
  };
}
export default ProductDetails;
