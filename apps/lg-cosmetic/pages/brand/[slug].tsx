import * as config from "@hera/config";
import {
  getBrandDetailService,
  getBrandsListService,
  IBrand,
  useDetailBrand,
  useListBrands,
  useListCategories,
  useListProduct,
} from "@hera/data";
import { NextSEO } from "@hera/ui";
import { LcBanner, LcListProduct, LcSubscribeSection } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { LcBreadcrumbs, LcChip, LcFilter } from "@lc/LcProductsComponent";
import { IFilterParams } from "@lc/types";
import { Box, Container } from "@mui/material";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FC, useLayoutEffect, useState } from "react";

interface IProps extends IBrand {}

const CategoryProducts: FC<IProps> = ({
  name: metaBrandName,
  slug: metaBrandSlug,
}) => {
  const isPC = useBreakPoint("sm");
  const router = useRouter();
  const siteUrl = config.env.siteUrl;
  const brandSlug = router.query.slug as string;
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState({});

  const { data: brandsData } = useDetailBrand(brandSlug);
  const { data: brands } = useListBrands();
  const { data: categoryResponse } = useListCategories();
  const [listTaxonName, setListTaxonName] = useState([]);
  const [listBrandName, setListBrandName] = useState([]);

  const { data: response, isLoading } = useListProduct(filtersParams);
  const listCategories = categoryResponse?.categories?.root;

  const [deleteAllFlag, setDeleteAllFlag] = useState<boolean>(false);

  useLayoutEffect(() => {
    setFiltersParams({ brandIds: [brandsData?.id] });
  }, [brandsData]);

  const hadleSetFiterParams = (filters) => {
    const switchFiterParams = {};
    filters.map((data) => {
      if (data.filterName === "brandIds" && data.dataFilter.length === 0) {
        switchFiterParams["brandIds"] = [brandsData?.id];
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
    defaulParams["brandIds"] = [brandsData?.id];
    setFiltersParams(defaulParams);
    setListTaxonName([]);
    setListBrandName([]);
  };

  return (
    <>
      <NextSEO
        title={metaBrandName || ""}
        titleTemplate={`%s - LG VINA`}
        description={
          brandsData?.metaDescription ||
          `LGVINA là nơi mua sắm ${
            metaBrandName || ""
          } đáng tin cậy nhất. Chúng tôi cung cấp các sản phẩm ${
            metaBrandName || ""
          } giúp phụ nữ có cuộc sống hạnh phúc hơn.`
        }
        openGraph={{
          title: "CÔNG TY TNHH MỸ PHẨM LG VINA",
          type: "website",
          url: `${siteUrl}/brand/${metaBrandSlug}`,
          images: [
            {
              url: brandsData?.metaImg,
            },
          ],
          description:
            brandsData?.metaDescription ||
            `LGVINA là nơi mua sắm ${
              metaBrandName || ""
            } đáng tin cậy nhất. Chúng tôi cung cấp các sản phẩm ${
              metaBrandName || ""
            } giúp phụ nữ có cuộc sống hạnh phúc hơn.`,
        }}
      />
      <Box mt={5} mb={{ xs: 5, sm: 0 }}>
        <LcBanner banner={brandsData} withContent={false} />
      </Box>
      <Container>
        <Box mb={{ xs: 10, sm: 17 }} minHeight="100vh">
          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
            }}
            justifyContent="space-between"
            alignItems="center"
          >
            <LcBreadcrumbs brandName={brandsData?.name} />
            {listCategories && (
              <LcFilter
                onOpenFilter={() => setOpenFilter(!openFilter)}
                isOpen={openFilter}
                onSetFilterParams={hadleSetFiterParams}
                brands={brands}
                listCategories={listCategories}
                deleteAllFlag={deleteAllFlag}
                filtersParams={filtersParams as IFilterParams}
                onSetListBrandName={setListBrandName}
                listBrandName={listBrandName}
                brandsData={brandsData}
              />
            )}
          </Box>
          <Box>
            {Object.keys(filtersParams).length === 0 ? (
              <Box></Box>
            ) : (
              <LcChip
                onDeleteAllFilter={handleDeleteAllFilter}
                listBrandName={listBrandName}
                listCategories={listCategories}
                filtersParams={filtersParams as IFilterParams}
              />
            )}
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
                setFiltersParams({ ...filtersParams, page: page });
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

export default CategoryProducts;

export const getStaticPaths = async ({ params }) => {
  const brands = await getBrandsListService();

  const paths = (brands || []).map((brand) => ({
    params: { slug: brand?.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const data = await getBrandDetailService(params?.slug as string);
    if (!data?.id) {
      throw new Error("Not found");
    }
    return {
      props: data,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
