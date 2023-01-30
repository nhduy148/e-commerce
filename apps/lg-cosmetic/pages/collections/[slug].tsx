import * as config from "@hera/config";
import {
  getCollectionListService,
  IMainBanner,
  Taxon,
  useGetListDetailTaxon,
  useListBrands,
  useListProduct,
} from "@hera/data";
import { NextSEO } from "@hera/ui";
import { LcBanner, LcListProduct, LcSubscribeSection } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { LcBreadcrumbs } from "@lc/LcProductsComponent";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";

const CollectionProducts = ({
  name: metaCollectionName,
  slug: metaCollectionSlug,
}) => {
  const isPC = useBreakPoint("sm");
  const router = useRouter();
  const taxonSlug = router.query.slug as string;
  const siteUrl = config.env.siteUrl;
  const { data: brands } = useListBrands();
  const { data: taxonDetail } = useGetListDetailTaxon(taxonSlug);

  const [filtersParams, setFiltersParams] = useState({});
  const [deleteAllFlag, setDeleteAllFlag] = useState<boolean>(false);

  useLayoutEffect(() => {
    setFiltersParams({ taxonIds: [taxonDetail?.id] });
  }, [taxonDetail]);

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const { data: response, isLoading } = useListProduct(filtersParams);

  const hadleSetFiterParams = (filters) => {
    const switchFiterParams = {};
    filters.map((data) => {
      if (data.filterName === "taxonIds" && data.dataFilter.length === 0) {
        switchFiterParams["taxonIds"] = [taxonDetail?.id];
      }
      if (data.dataFilter.length === 0) return;
      return (switchFiterParams[data.filterName] = data.dataFilter);
    });
    setFiltersParams(switchFiterParams);
    setOpenFilter(false);
  };

  const handleDeleteAllFilter = () => {
    setDeleteAllFlag(!deleteAllFlag);
    const defaulParams = {};
    defaulParams["taxonIds"] = [taxonDetail?.id];
    setFiltersParams(defaulParams);
  };
  return (
    <>
      <NextSEO
        title={metaCollectionName || ""}
        titleTemplate={`%s - LG VINA`}
        description={
          taxonDetail?.metaDescription ||
          `LGVINA là nơi mua sắm ${
            metaCollectionName || ""
          } đáng tin cậy nhất. Chúng tôi cung cấp các sản phẩm ${
            metaCollectionName || ""
          } giúp phụ nữ có cuộc sống hạnh phúc hơn.`
        }
        openGraph={{
          title: "CÔNG TY TNHH MỸ PHẨM LG VINA",
          url: `${siteUrl}/collections/${metaCollectionSlug}`,
          images: [
            {
              url: taxonDetail?.metaImg,
            },
          ],
          description:
            taxonDetail?.metaDescription ||
            `LGVINA là nơi mua sắm ${
              metaCollectionName || ""
            } đáng tin cậy nhất. Chúng tôi cung cấp các sản phẩm ${
              metaCollectionName || ""
            } giúp phụ nữ có cuộc sống hạnh phúc hơn.`,
        }}
      />
      <Box mt={5} mb={{ xs: 5, sm: 0 }}>
        <LcBanner banner={taxonDetail as unknown as IMainBanner} />
      </Box>
      <Container>
        <Box mb={{ xs: 10, sm: 17 }} minHeight="100vh">
          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
            }}
            justifyContent="space-between"
            alignItems="center"
            mb="36px"
          >
            <LcBreadcrumbs breadcrumbs={taxonDetail?.breadcrumbs} />
          </Box>
          <LcListProduct
            products={response?.data || []}
            enablePagination
            isLoading={isLoading}
            pagination={response?.paginate}
            paginationProps={{
              onChange: (e, page) => {
                if (page === response?.paginate?.page) {
                  return;
                }
                let newFilterPrams = {};
                if (
                  filtersParams["taxonIds"].some(
                    (data) => data === taxonDetail?.id,
                  )
                ) {
                  newFilterPrams = {
                    ...filtersParams,
                    taxonIds: [taxonDetail?.id],
                    page: page,
                  };
                } else {
                  newFilterPrams = {
                    ...filtersParams,
                    page: page,
                  };
                }
                setFiltersParams(newFilterPrams);
              },
            }}
          />
          <Box mt={8}>
            <LcSubscribeSection />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export const getStaticPaths = async () => {
  const collections = await getCollectionListService();

  const paths = collections.map((collection) => {
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
};

export const getStaticProps = async ({ params }) => {
  try {
    const data = await Taxon.getListDetailTaxon(params?.slug as string);

    if (!data?.id) {
      throw new Error("Not found");
    }

    return {
      props: {
        name: data?.name || "",
        slug: data?.slug || "",
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default CollectionProducts;
