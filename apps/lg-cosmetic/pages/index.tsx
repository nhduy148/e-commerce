import {
  IHomePageData,
  useBannerData,
  useGetBlogListPost,
  useGetJustForYou,
  useHomePageDataQuery,
  useListProduct,
  useListRunningSaleEvents,
  useShopInShop,
} from "@hera/data";
import { NextSEO } from "@hera/ui";
import {
  LcListProduct,
  LcSliderListProduct,
  LcSubscribeSection,
} from "@lc/components";
import {
  LcBrandList,
  LcHomePromotionBanner,
  LcHomeReviewList,
  LcHomeSlider,
  LcMobileBrands,
} from "@lc/HomeComponents";
import { useBreakPoint } from "@lc/hooks";
import { Box, Container } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

export function Index() {
  const { data, isLoading: pageDataLoading } = useHomePageDataQuery("lgc");
  const pageData = useMemo(() => data as IHomePageData, [data]);
  const { formatMessage } = useIntl();
  const translate = {
    flashSale: formatMessage({ id: "homePage.flashSale" }),
    bestSelling: formatMessage({ id: "homePage.bestSelling" }),
    justForYou: formatMessage({ id: "homePage.justForYou" }),
    brand: formatMessage({ id: "homePage.brand" }),
    collection: formatMessage({ id: "homePage.collection" }),
  };
  const isPC = useBreakPoint("sm");
  const isPCLarge = useBreakPoint("lg");
  const [currentFlashSale, setCurrentFlashSale] = useState<number | null>(null);

  useEffect(() => {
    if (pageData?.flashSales?.length === 1) {
      setCurrentFlashSale(pageData.flashSales[0]?.id);
    } else {
      pageData?.flashSales.map(({ id, startAt, endAt }) => {
        dayjs().isBetween(dayjs(startAt), dayjs(endAt)) &&
          setCurrentFlashSale(id);
      });
    }
  }, [pageData?.flashSales]);

  const { data: flashSales, isLoading: flashSalesLoading } = useListProduct({
    saleEventIds: [currentFlashSale],
    size: 10,
  });

  const { data: collections, isLoading: collectionsLoading } = useListProduct({
    taxonIds: [pageData?.collection?.id],
    size: isPCLarge ? 5 : isPC ? 4 : 4,
  });

  const { data: justForYou, isLoading: justForYouLoading } = useGetJustForYou();

  const { data: blogs, isLoading: blogsLoading } = useGetBlogListPost({
    size: 2,
  });

  const { data: bannerData, isLoading: bannerLoading } = useBannerData({
    isActive: true,
    position: "homepage.secondary-banners",
  });

  const { data: listBrandBanner, isLoading: isListBannerLoading } =
    useBannerData({
      isActive: true,
      position: "homepage.slider.brands",
    });

  const { data: runningSaleEventsData, isLoading: runningSaleEventLoading } =
    useListRunningSaleEvents();

  const { data: shopInShopHomePage, isLoading: homepageLoading } =
    useShopInShop("homepage");

  return (
    <>
      <NextSEO
        title="CÔNG TY TNHH MỸ PHẨM LG VINA"
        description="Công ty TNHH Mỹ phẩm LG VINA tự hào mang đến cho khách hàng Việt Nam những thương hiệu mỹ phẩm uy tín và các thương hiệu chăm sóc nhà cửa, chăm sóc cá nhân cao cấp."
        openGraph={{
          title: "CÔNG TY TNHH MỸ PHẨM LG VINA",
          url: "https://mall.lgvina.vn/",
          images: [
            {
              url: "",
            },
          ],
          description:
            "Công ty TNHH Mỹ phẩm LG VINA tự hào mang đến cho khách hàng Việt Nam những thương hiệu mỹ phẩm uy tín và các thương hiệu chăm sóc nhà cửa, chăm sóc cá nhân cao cấp.",
        }}
      />
      <Box mt={{ sm: 5, xs: 2 }}>
        {(shopInShopHomePage?.data?.content || []).map((content) => {
          if (content.type === "slider") {
            return (
              <Box mb={{ sm: 6, xs: 8 }}>
                <LcHomeSlider
                  sliders={content?.slider?.sliderItems || []}
                  listBrands={listBrandBanner?.data || []}
                  isLoading={
                    pageDataLoading || isListBannerLoading || homepageLoading
                  }
                />
              </Box>
            );
          }
        })}
        <Box mb={{ sm: 0, xs: 10 }}>
          <LcMobileBrands listBrands={listBrandBanner?.data || []} />
        </Box>
        {pageData?.flashSales?.length > 0 && currentFlashSale !== null && (
          <Box mb={{ sm: 7, xs: 8 }}>
            <LcSliderListProduct
              heading={translate.flashSale}
              products={flashSales?.data || []}
              isLoading={flashSalesLoading}
            />
          </Box>
        )}
        <Box mb={{ sm: 7, xs: 8 }}>
          <LcSliderListProduct
            heading={translate.bestSelling}
            products={runningSaleEventsData?.data || []}
            isLoading={runningSaleEventLoading}
          />
        </Box>
        <Container maxWidth="lg">
          <Box mb={{ sm: 12, xs: 8 }}>
            <LcHomePromotionBanner
              banners={bannerData?.data || []}
              isLoading={bannerLoading}
              limit={2}
            />
          </Box>
          <Box mb={{ sm: 11, xs: 8 }}>
            <LcListProduct
              heading={translate.collection}
              products={collections?.data || []}
              isLoading={collectionsLoading}
              pagination={collections?.paginate}
              enableShowMoreButton
              layout={{ lg: 5, md: 4, xs: 2 }}
              collectionSlug={pageData?.collection?.slug}
            />
          </Box>
        </Container>
        {(shopInShopHomePage?.data?.content || []).map((content) => {
          if (content.type === "block_brand") {
            return (
              <Box mb={{ sm: 11, xs: 8 }}>
                <LcBrandList
                  heading={translate.brand}
                  brands={content?.brands || []}
                />
              </Box>
            );
          }
        })}
        {justForYou?.data?.length > 0 && (
          <Box mb={{ sm: 7, xs: 8 }}>
            <LcSliderListProduct
              heading={translate.justForYou}
              products={justForYou?.data || []}
              isLoading={justForYouLoading}
            />
          </Box>
        )}
        <Container maxWidth="lg">
          {blogs?.data?.length > 0 && (
            <Box mb={{ sm: 6, xs: 8 }}>
              <LcHomeReviewList heading="Review" data={blogs?.data || []} />
            </Box>
          )}
          <Box mb={{ sm: 8, xs: 8 }}>
            <LcSubscribeSection />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Index;
