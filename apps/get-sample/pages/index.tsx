import {
  GSPListBanner,
  GSPListProduct,
  GSPSliderListProduct,
} from "@gsp/components";
import { GSPHomeGuide, GSPHomeSlider } from "@gsp/HomeComponents";
import { GuideCategory, GuideStep } from "@gsp/types";
import {
  IShoppageComponent,
  IShoppageSection,
  useHomePageDataQuery,
} from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { Box, Container, Skeleton, Stack } from "@mui/material";
import { useMemo } from "react";

export function Index() {
  const { __ } = useFormatter();
  const { data, isLoading: pageDataLoading } = useHomePageDataQuery("gsp");
  // @ts-ignore
  const pageData = (data?.data?.content || []) as IShoppageSection[];

  const sliderBanners = pageData.find((data) => data.type === "slider")?.slider;

  const staticGuideSteps = useMemo<GuideStep[]>(
    () => [
      {
        image: "GetSampleStep01",
        text: __({ defaultMessage: "Chọn hộp quà yêu thích" }),
      },
      {
        image: "GetSampleStep02",
        text: __({ defaultMessage: "Đăng ký thông tin nhận" }),
      },
      {
        image: "GetSampleStep03",
        text: __({ defaultMessage: "Nhận hộp quà" }),
      },
    ],
    [],
  );
  const staticGuideCategories = useMemo<GuideCategory[]>(
    () => [
      {
        image: "Category01",
        name: __({ defaultMessage: "Mẹ và bé" }),
      },
      {
        image: "Category02",
        name: __({ defaultMessage: "Làm đẹp" }),
      },
      {
        image: "Category03",
        name: __({ defaultMessage: "Nhà cửa" }),
      },
      {
        image: "Category04",
        name: __({ defaultMessage: "Thú cưng" }),
      },
      {
        image: "Category05",
        name: __({ defaultMessage: "Điện tử" }),
      },
    ],
    [],
  );

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
          showHeading={data?.showTitle}
          heading={data?.showTitle === true ? data.title : ""}
          products={data?.products || []}
          showEmptyText
        />
      ),
    };

    return components[data.type];
  };

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

  return (
    <Box mb={7.5}>
      {sliderBanners && (
        <Box mb={7.5}>
          <GSPHomeSlider sliders={sliderBanners} isLoading={pageDataLoading} />
        </Box>
      )}
      <Container>
        <GSPHomeGuide
          steps={staticGuideSteps}
          categories={staticGuideCategories}
        />
        <Stack spacing={7.5}>{pageData?.map(renderHomepageSections)}</Stack>
      </Container>
    </Box>
  );
}

export default Index;
