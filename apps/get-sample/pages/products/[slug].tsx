import { GSPBreadcrumb, GSPHead } from "@gsp/components";
import {
  GSPProductDetails,
  GSPProductDetailSurveyForm,
  GSPProductOverview,
} from "@gsp/ProductDetailsComponent";
import { IProductDetail, Product, useGetProductDetail } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

const ProductDetails = ({
  productDetails: productDetailsData,
}: {
  productDetails: IProductDetail;
}) => {
  const router = useRouter();
  const { query } = router;
  const surveyFormRef = useRef<any>(null);
  const { __ } = useFormatter();

  const {
    data: productDetails,
    status,
    isLoading: isGettingProductDetails,
  } = useGetProductDetail(query.slug as string, productDetailsData);

  useEffect(() => {
    if (status === "error") {
      router.push("/404");
    }
  }, [status]);

  const breadcrumbLinks = [
    { name: `${__({ defaultMessage: "Sản phẩm" })}`, link: "products" },
    { name: productDetails?.name, link: "#" },
  ];

  const handleRegisterGetSample = useCallback(() => {
    if (productDetails.inStock <= 0) {
      return;
    }
    if (surveyFormRef.current) {
      window.scrollTo({
        left: 0,
        top: (surveyFormRef.current?.offsetTop || 50) - 50,
        behavior: "smooth",
      });
    }
  }, [productDetails, surveyFormRef]);

  return (
    <>
      <GSPHead
        title={productDetailsData?.name}
        titleTemplate="%s | Quà Tặng Miễn Phí"
        description={`Nhận ngay sản phẩm ${productDetailsData?.name} hoàn toàn miễn phí, giao hàng tận nhà.`}
        openGraph={{
          url: `https://quatangmienphi.vn/products/${productDetailsData?.slug}`,
          images: [
            {
              url: productDetailsData?.images?.find((image) => image.isDefault)
                ?.small,
            },
          ],
          description: `Nhận ngay sản phẩm ${productDetailsData?.name} hoàn toàn miễn phí, giao hàng tận nhà.`,
        }}
      />

      <Box minHeight="100vh">
        <Box mt={3.5}>
          <Container sx={{ marginBottom: 12.5 }}>
            <GSPBreadcrumb
              data={breadcrumbLinks}
              isLoading={isGettingProductDetails}
            />
            <GSPProductOverview
              productDetail={productDetails}
              isLoading={isGettingProductDetails}
              onRegisterGetSample={handleRegisterGetSample}
            />
            <GSPProductDetails
              productDetail={productDetails}
              isLoading={isGettingProductDetails}
            />
          </Container>
          {productDetails?.questionForm?.isActive && (
            <Box ref={surveyFormRef}>
              <GSPProductDetailSurveyForm
                formSections={productDetails?.questionForm.content || []}
                productDetails={productDetails}
                questionFormId={productDetails?.questionForm.id}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const getProducts = async (page = 1) => {
    let products = [];
    try {
      const listProduct = await Product.listProduct({ size: 100, page });
      if (!listProduct?.data) {
        throw new Error("Missing {listProduct.data}");
      }
      products = listProduct.data;
      if (listProduct?.paginate?.hasNext) {
        const nextProducts = await getProducts(page + 1);
        products = [...products, ...nextProducts];
      }
      return products;
    } catch (err) {
      return [];
    }
  };

  try {
    const products = await getProducts(1);

    const paths = (products || []).map((product) => {
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
  } catch {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const productDetails = await Product.getProductDetails(
      params?.slug as string,
    );

    if (!productDetails?.id) {
      throw new Error("Not found");
    }

    return {
      props: { productDetails },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default ProductDetails;
