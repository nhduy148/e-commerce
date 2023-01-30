import {
  GSPBreadcrumb,
  GSPListBanner,
  GSPListProduct,
  GSPSliderListProduct,
} from "@gsp/components";
import {
  IShoppageComponent,
  IShoppageSection,
  useShopInShop,
} from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Skeleton, Stack } from "@mui/material";
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

  const breadcrumbData = [
    { name: pageData?.data.title || __({ defaultMessage: "Không tìm thấy" }) },
  ];

  const renderHomepageSections = (data: IShoppageSection, index: number) => {
    const components: IShoppageComponent = {
      block_banner: (
        <GSPListBanner
          key={index}
          heading={data?.title || ""}
          showHeading={data?.showTitle}
          headingImage={data?.bannerImage}
          banners={data?.banners || []}
        />
      ),
      block_product: (
        <GSPListProduct
          key={index}
          heading={data.title}
          showHeading={data?.showTitle}
          banners={data?.banners || []}
          products={data?.products || []}
          showEmptyText
          layout={{ md: 4, xs: 2 }}
        />
      ),
      product_slider: (
        <GSPSliderListProduct
          key={index}
          heading={data?.showTitle === true ? data.title : ""}
          products={data?.products || []}
          showHeading={data?.showTitle}
          showEmptyText
        />
      ),
    };

    return components[data.type];
  };

  return (
    <Container>
      <Box mb={7.5}>
        <Box py={1}>
          <GSPBreadcrumb data={breadcrumbData} isLoading={isLoading} />
        </Box>
        <Stack spacing={7.5}>
          {pageData?.data?.content.map(renderHomepageSections)}
        </Stack>
      </Box>
    </Container>
  );
};

export default ShopInShop;
