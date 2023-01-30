import { getAllCategories } from "@gsp/utils";

import {
  GSPBreadcrumb,
  GSPHead,
  GSPListProduct,
  GSPSectionHeading,
  GSPSingleBanner,
} from "@gsp/components";

import {
  Category,
  IAllCategories,
  IDetailTaxon,
  IPaginationQuery,
  IResponseWithStatus,
  Taxon,
  useGetListDetailTaxon,
  useListProduct,
} from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Stack } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const ListProductByCategory = ({
  categoryDetails,
}: {
  categoryDetails: IDetailTaxon;
}) => {
  const { __ } = useFormatter();
  const router = useRouter();
  const categorySlug = router.query.slug as string;
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetListDetailTaxon(categorySlug);
  const [paginate, setPaginate] = useState<IPaginationQuery>({
    page: 1,
    size: 12,
  });

  const { data: response, isLoading: isListProductLoading } = useListProduct({
    ...paginate,
    taxonIds: [categoryData?.id],
  });

  const breadcrumbData = [{ name: categoryData?.name }];

  return (
    <>
      <GSPHead
        title={categoryDetails?.name}
        titleTemplate="%s | Quà Tặng Miễn Phí"
        description={`Nhận ngay sản phẩm ${categoryDetails?.name} hoàn toàn miễn phí, giao hàng tận nhà.`}
        openGraph={{
          url: `https://quatangmienphi.vn/category/${categoryDetails?.slug}`,
          images: [
            {
              url: categoryDetails?.metaImg,
            },
          ],
          description: `Quà Tặng Miễn Phí  mang đến cho bạn những sản phẩm ${categoryDetails?.name} chất lượng và hoàn toàn miễn phí.`,
        }}
      />
      <Container sx={{ mb: 7.5 }}>
        <Box py={1}>
          <GSPBreadcrumb data={breadcrumbData} isLoading={isCategoryLoading} />
        </Box>
        <Stack spacing={7.5}>
          <Box>
            <GSPSingleBanner
              banner={{
                desktopImageUrl: categoryData?.listingBannerDesktop,
                mobileImageUrl: categoryData?.listingBannerMobile,
              }}
              ratio={{ x: 1240, y: 250 }}
              isLoading={isCategoryLoading}
            />
          </Box>
          <Box>
            <Box mb={5}>
              <GSPSectionHeading text={categoryData?.name} />
            </Box>
            <GSPListProduct
              products={response?.data || []}
              enablePagination
              isLoading={isListProductLoading}
              showEmptyText
              emptyText={__({ defaultMessage: "Chưa có sản phẩm nào" })}
              layout={{
                md: 4,
                xs: 2,
              }}
              pagination={response?.paginate}
              paginationProps={{
                onChange: (e, page) => {
                  if (page === response?.paginate?.page) {
                    return;
                  }
                  setPaginate((prev) => ({ ...prev, page }));
                },
              }}
            />
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const getCategoriesList = async () => {
    try {
      const categories: Awaited<Promise<IResponseWithStatus<IAllCategories>>> =
        await Category.service.get();
      const slugsList = getAllCategories(categories?.data?.categories?.root);

      const paths = slugsList.map((slug) => {
        return {
          params: {
            slug,
          },
        };
      });

      return paths;
    } catch {
      return [];
    }
  };

  try {
    const categories = await getCategoriesList();

    return {
      paths: categories,
      fallback: "blocking",
    };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const categoryDetails = await Taxon.getListDetailTaxon(
      params?.slug as string,
    );

    return {
      props: { categoryDetails },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default ListProductByCategory;
