import { IShopInShopContentItem, useGetShopInShopQuery } from "@hera/data";
import {
  LcBannerBlock,
  LcListProduct,
  LcSliderListProduct,
  LcSubscribeSection,
} from "@lc/components";
import { LcBreadcrumbs } from "@lc/LcProductsComponent";
import { Box, Container, Stack } from "@mui/material";
import { useRouter } from "next/router";

const ShopInShop = () => {
  const router = useRouter();

  const brandSlug = router.query.slug as string;

  const { data: shopInShopData, isLoading: shopInShopDataLoading } =
    useGetShopInShopQuery(brandSlug);

  const pageData = shopInShopData?.data?.content || [];

  const renderShopInShopBlocks = (
    data: IShopInShopContentItem,
    index: number,
  ) => {
    const components = {
      block_banner: (
        <LcBannerBlock
          key={index}
          heading={data?.title || ""}
          showHeading={data?.showTitle}
          headingImage={data?.bannerImage}
          banners={data?.banners || []}
        />
      ),
      block_product: (
        <LcListProduct
          key={index}
          banners={data?.banners || []}
          showHeading={data?.showTitle}
          products={data?.products}
          heading={data?.title}
        />
      ),
      product_slider: (
        <LcSliderListProduct
          key={index}
          heading={data?.showTitle === true ? data.title : ""}
          products={data?.products || []}
        />
      ),
    };

    return components[data.type];
  };

  return (
    <Box mb={{ lg: 9, sm: 7, xs: 5 }} mt={3}>
      <Container>
        <Box mb="50px">
          <LcBreadcrumbs brandName={shopInShopData?.data.title} />
        </Box>

        <Stack spacing={{ lg: 9, sm: 7, xs: 5 }}>
          {pageData?.map(renderShopInShopBlocks)}
        </Stack>

        <Box mt={8}>
          <LcSubscribeSection />
        </Box>
      </Container>
    </Box>
  );
};

export default ShopInShop;
