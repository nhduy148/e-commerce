import {
  IShoppageComponent,
  IShoppageSection,
  useShopInShop,
} from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Skeleton, Stack } from "@mui/material";
import {
  NesListBanner,
  NesListProduct,
  NesSliderListProduct,
} from "@nestle/components";
import { NesBreadcrumbs } from "apps/nestle/components/NesProducts";
import { useRouter } from "next/router";

const ShopInShop = () => {
  const { __ } = useFormatter();
  const router = useRouter();
  const { data: pageData, isLoading } = useShopInShop(
    router.query.slug.toString(),
  );

  if (isLoading) {
    return (
      <Container>
        <Stack spacing={2} sx={{ pt: { sm: 12, xs: 8 }, pb: 10 }}>
          {[...Array(4).keys()].map(() => (
            <Box height={240}>
              <Skeleton width="100%" height="100%" variant="rectangular" />
            </Box>
          ))}
        </Stack>
      </Container>
    );
  }

  const renderHomepageSections = (data: IShoppageSection, index: number) => {
    const components: IShoppageComponent = {
      block_banner: (
        <NesListBanner
          key={index}
          heading={data?.title || ""}
          showHeading={data?.showTitle}
          headingImage={data?.bannerImage}
          banners={data?.banners || []}
        />
      ),
      block_product: (
        <NesListProduct
          key={index}
          heading={data.title}
          showHeading={data?.showTitle}
          banners={data?.banners || []}
          products={data?.products || []}
          showEmptyText
          layout={{ md: 3, xs: 2 }}
        />
      ),
      product_slider: (
        <NesSliderListProduct
          key={index}
          heading={data?.showTitle === true ? data.title : ""}
          products={data?.products || []}
          showEmptyText
        />
      ),
    };

    return components[data.type];
  };

  return (
    <Container>
      <Box mt={4} mb={{ xs: 5, md: 9 }}>
        <Box mb={{ xs: 3, md: 4 }}>
          <NesBreadcrumbs
            brandName={
              pageData?.data.title || __({ defaultMessage: "Không tìm thấy" })
            }
          />
        </Box>
        <Stack spacing={{ md: 4, xs: 3 }}>
          {pageData?.data?.content.map(renderHomepageSections)}
        </Stack>
      </Box>
    </Container>
  );
};

export default ShopInShop;
