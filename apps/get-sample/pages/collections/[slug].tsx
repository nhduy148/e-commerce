import {
  getCollectionsService,
  IDetailTaxon,
  IPaginationQuery,
  Taxon,
  useGetListDetailTaxon,
  useListProduct,
} from "@hera/data";

import {
  GSPBreadcrumb,
  GSPHead,
  GSPListProduct,
  GSPSectionHeading,
  GSPSingleBanner,
} from "@gsp/components";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Stack } from "@mui/material";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const ListProductByCollection = ({
  collectionDetails,
}: {
  collectionDetails: IDetailTaxon;
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
        title={collectionDetails?.name}
        titleTemplate="%s | Quà Tặng Miễn Phí"
        description={
          collectionDetails?.metaDescription ||
          `Nhận ngay sản phẩm ${collectionDetails?.name} hoàn toàn miễn phí, giao hàng tận nhà.`
        }
        openGraph={{
          url: `https://quatangmienphi.vn/collections/${collectionDetails?.slug}`,
          images: [
            {
              url: collectionDetails?.metaImg,
            },
          ],
          description: `Quà Tặng Miễn Phí  mang đến cho bạn những sản phẩm ${collectionDetails?.name} chất lượng và hoàn toàn miễn phí`,
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
  const getCollectionsList = async () => {
    try {
      const { data: collectionsList } = await getCollectionsService();

      return collectionsList;
    } catch {
      return [];
    }
  };

  try {
    const collectionsList = await getCollectionsList();

    const paths = collectionsList.map((collection) => {
      return {
        params: {
          slug: collection.slug,
        },
      };
    });

    return {
      paths,
      fallback: "blocking",
    };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const collectionDetails = await Taxon.getListDetailTaxon(
      params?.slug as string,
    );

    return {
      props: {
        collectionDetails,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default ListProductByCollection;
