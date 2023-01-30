import {
  IShoppageComponent,
  IShoppageSection,
  useHomePageDataQuery,
} from "@hera/data";
import { Box, Container, Skeleton, Stack } from "@mui/material";
import {
  NesListBanner,
  NesListProduct,
  NesSliderListProduct,
} from "@nestle/components";
import { NesHomeSlider } from "@nestle/HomeComponents";

export function Index() {
  const { data, isLoading: pageDataLoading } = useHomePageDataQuery("nes");
  // @ts-ignore
  const pageData = (data?.data?.content || []) as IShoppageSection[];

  if (pageDataLoading) {
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

  const sliderBanners = pageData.find((data) => data.type === "slider")?.slider;

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
          layout={{ md: 4, xs: 2 }}
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
    <Box mb={{ lg: 9, sm: 7, xs: 5 }} mt={3}>
      <Container maxWidth="lg">
        <Stack spacing={{ lg: 9, sm: 7, xs: 5 }}>
          <NesHomeSlider sliders={sliderBanners} isLoading={pageDataLoading} />
          {pageData?.map(renderHomepageSections)}
        </Stack>
      </Container>
    </Box>
  );
}

export default Index;
