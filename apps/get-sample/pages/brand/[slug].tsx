import {
  GSPBreadcrumb,
  GSPHead,
  GSPListProduct,
  GSPSectionHeading,
  GSPSingleBanner,
} from "@gsp/components";

import {
  getBrandDetailService,
  getBrandsListService,
  IBrand,
  IPaginationQuery,
  useDetailBrand,
  useListProduct,
} from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Stack } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const ListProductByBrand = ({ brandDetails }) => {
  const { __ } = useFormatter();
  const router = useRouter();
  const brandSlug = router.query.slug as string;

  const { data: brandsData, isLoading: isBrandLoading } =
    useDetailBrand(brandSlug);

  const [paginate, setPaginate] = useState<IPaginationQuery>({
    page: 1,
    size: 12,
  });

  const { data: response, isLoading: isListProductLoading } = useListProduct({
    ...paginate,
    brandIds: [brandsData?.id],
  });

  const breadcrumbData = [{ name: brandsData?.name }];

  return (
    <>
      <GSPHead
        title={brandDetails?.name}
        titleTemplate="%s | Quà Tặng Miễn Phí"
        description={`Nhận ngay sản phẩm ${brandDetails?.name} hoàn toàn miễn phí, giao hàng tận nhà.`}
        openGraph={{
          url: `https://quatangmienphi.vn/brand/${brandDetails?.slug}`,
          images: [
            {
              url: brandDetails?.metaImg,
            },
          ],
          description: `Quà Tặng Miễn Phí  mang đến cho bạn những sản phẩm ${brandDetails?.name} chất lượng và hoàn toàn miễn phí"`,
        }}
      />
      <Container sx={{ mb: 7.5 }}>
        <Box py={1}>
          <GSPBreadcrumb data={breadcrumbData} isLoading={isBrandLoading} />
        </Box>
        <Stack spacing={7.5}>
          <Box>
            <GSPSingleBanner
              banner={brandsData}
              ratio={{ x: 1240, y: 250 }}
              isLoading={isBrandLoading}
            />
          </Box>
          <Box>
            <Box mb={5}>
              <GSPSectionHeading text={brandsData?.name} />
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
  const getBrandsList = async () => {
    try {
      const brandsList: Awaited<Promise<IBrand[]>> =
        await getBrandsListService();

      return brandsList;
    } catch (err) {
      return [];
    }
  };

  try {
    const brandsList = await getBrandsList();

    const paths = brandsList.map((brand) => ({
      params: { slug: brand?.slug },
    }));

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
    const brandDetails = await getBrandDetailService(params?.slug as string);

    if (!brandDetails?.id) {
      throw new Error("Not found");
    }

    return {
      props: { brandDetails },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default ListProductByBrand;
