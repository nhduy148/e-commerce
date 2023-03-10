import * as config from "@hera/config";
import {
  Category,
  IMainBanner,
  Taxon,
  useGetListDetailTaxon,
  useListBrands,
  useListCategories,
  useListProduct,
} from "@hera/data";
import { NextSEO } from "@hera/ui";
import { LcBanner, LcListProduct, LcSubscribeSection } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { LcBreadcrumbs, LcChip, LcFilter } from "@lc/LcProductsComponent";
import { IFilterParams } from "@lc/types";
import { getAllTaxonvalues } from "@lc/utils";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";

const CategoryProducts = ({
  name: metaCategoryName,
  slug: metaCategorySlug,
}) => {
  const isPC = useBreakPoint("sm");
  const siteUrl = config.env.siteUrl;
  const router = useRouter();
  const taxonSlug = router.query.slug as string;
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState({});

  const { data: brands } = useListBrands();

  const { data: taxonDetail } = useGetListDetailTaxon(taxonSlug);
  const { data: categoryResponse } = useListCategories();
  const [listBrandName, setListBrandName] = useState([]);

  const { data: response, isLoading } = useListProduct(filtersParams);
  const listCategories = categoryResponse?.categories?.root;

  const [deleteAllFlag, setDeleteAllFlag] = useState<boolean>(false);

  useLayoutEffect(() => {
    setFiltersParams({ taxonIds: [taxonDetail?.id] });
  }, [taxonDetail]);

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
    setListBrandName([]);
  };

  return (
    <>
      <NextSEO
        title={metaCategoryName || ""}
        titleTemplate={`%s - LG VINA`}
        description={
          taxonDetail?.metaDescription ||
          `LGVINA l?? n??i mua s???m ${
            metaCategoryName || ""
          } ????ng tin c???y nh???t. Ch??ng t??i cung c???p c??c s???n ph???m ${
            metaCategoryName || ""
          } gi??p ph??? n??? c?? cu???c s???ng h???nh ph??c h??n.`
        }
        openGraph={{
          title: "C??NG TY TNHH M??? PH???M LG VINA",
          url: `${siteUrl}/category/${metaCategorySlug}`,
          images: [
            {
              url: taxonDetail?.metaImg,
            },
          ],
          description:
            taxonDetail?.metaDescription ||
            `LGVINA l?? n??i mua s???m ${
              metaCategoryName || ""
            } ????ng tin c???y nh???t. Ch??ng t??i cung c???p c??c s???n ph???m ${
              metaCategoryName || ""
            } gi??p ph??? n??? c?? cu???c s???ng h???nh ph??c h??n.`,
        }}
      />
      <Box mt={5} mb={{ xs: 5, sm: 0 }}>
        <LcBanner
          banner={taxonDetail as unknown as IMainBanner}
          withContent={false}
        />
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
            <LcBreadcrumbs breadcrumbs={taxonDetail?.breadcrumbs} />
            {listCategories && (
              <LcFilter
                onOpenFilter={() => setOpenFilter(!openFilter)}
                isOpen={openFilter}
                onSetFilterParams={hadleSetFiterParams}
                brands={brands}
                listCategories={listCategories}
                deleteAllFlag={deleteAllFlag}
                filtersParams={filtersParams as IFilterParams}
                taxonDetail={taxonDetail}
                listBrandName={listBrandName}
                onSetListBrandName={setListBrandName}
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
                taxonDetail={taxonDetail}
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

export const getStaticPaths = async () => {
  const categories = await Category.objects.find();

  let categoryList = getAllTaxonvalues(categories?.categories?.root);

  const firstTwentyCategories = categoryList.slice(0, 20);

  const paths = firstTwentyCategories.map((taxon) => {
    return {
      params: {
        slug: taxon.slug,
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

export default CategoryProducts;
