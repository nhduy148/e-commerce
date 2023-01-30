import * as config from "@hera/config";

import { Product, useGetProductDetail } from "@hera/data";
import { NextSEO } from "@hera/ui";
import {
  LcProductDetailBreadcrumbs,
  LcProductDetailContent,
  LcProductDetailInfo,
  LcRelatedProduct,
} from "@lc/LcProductDetailComponent";
import { Box, Container } from "@mui/material";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductDetails = ({ productDetail: metaProductDetail }) => {
  const router = useRouter();
  const siteUrl = config.env.siteUrl;
  const metaProductImage = metaProductDetail?.images.filter(
    (img) => img.isDefault,
  );

  const {
    data: productDetail,
    refetch: productDetailRefetch,
    status,
  } = useGetProductDetail(router.query.slug as string);

  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (status === "error") {
      router.push("/404");
    }
  }, []);

  return (
    <>
      <NextSEO
        title={metaProductDetail?.name || ""}
        titleTemplate={`%s - LG VINA`}
        description={
          metaProductDetail?.metaDescription ||
          `LGVINA là nơi mua sắm ${
            metaProductDetail?.name || ""
          } đáng tin cậy nhất. Chúng tôi cung cấp các sản phẩm ${
            metaProductDetail?.name || ""
          } giúp phụ nữ có cuộc sống hạnh phúc hơn.`
        }
        openGraph={{
          title: "CÔNG TY TNHH MỸ PHẨM LG VINA",
          type: "product",
          url: `${siteUrl}/products/${metaProductDetail?.slug}`,
          images: [
            {
              url: metaProductImage?.[0]?.original,
            },
          ],
          description:
            metaProductDetail?.metaDescription ||
            `LGVINA là nơi mua sắm ${
              metaProductDetail?.name || ""
            } đáng tin cậy nhất. Chúng tôi cung cấp các sản phẩm ${
              metaProductDetail?.name || ""
            } giúp phụ nữ có cuộc sống hạnh phúc hơn.`,
        }}
      />
      <Box minHeight="100vh">
        <Container>
          <Box mt={3.5}>
            {productDetail && (
              <>
                <LcProductDetailBreadcrumbs
                  breadcrumbList={productDetail?.breadcrumbs}
                />
                <LcProductDetailInfo
                  productDetail={productDetail}
                  commentCount={commentCount}
                  productDetailRefetch={productDetailRefetch}
                />
                <LcProductDetailContent
                  productDetail={productDetail}
                  setCommentCount={setCommentCount}
                  commentCount={commentCount}
                />
                <LcRelatedProduct productId={productDetail?.id} />
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const productDetail = await Product.getProductDetails(
      params?.slug as string,
    );

    if (!productDetail?.id) {
      throw new Error("Not found");
    }

    return {
      props: { productDetail },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export async function getStaticPaths(context) {
  let page = 1;
  let mergedProducts;

  const listProductParam = {
    size: 100,
    page: page,
  };

  const products = await Product.listProduct(listProductParam);
  const productsData = products.data;

  if (!products?.paginate?.hasNext) {
    mergedProducts = productsData;
  }

  if (products?.paginate?.hasNext) {
    page++;

    const nextProducts = await Product.listProduct(listProductParam);
    const nextProductsData = nextProducts.data;
    mergedProducts = [...productsData, ...nextProductsData];
  }

  const firstTwentyProducts = mergedProducts.slice(0, 20);

  const paths = (firstTwentyProducts || []).map((product) => {
    return {
      params: {
        slug: product.slug,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
export default ProductDetails;
