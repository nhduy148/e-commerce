import { useGetBlogPageData } from "@hera/data";
import { useBreakPoint } from "@nestle/hooks";
import { blogSection } from "@nestle/types";
import {
  NesBlogBeautyTips,
  NesBlogLiveStyle,
  NesBlogReviewProduct,
  NesBlogTakeCare,
  NesBlogTopTrending,
} from "apps/nestle/components/NesBlog";
import NesProductListLayout from "apps/nestle/components/NesProductListLayout";

const Blog = () => {
  const isPC = useBreakPoint("sm");
  const { data: pageData } = useGetBlogPageData();
  const pageDataBeautyTips = pageData?.data?.filter(
    (data) => data.slug === blogSection.beautyTips,
  );
  const pageDataLiveStyle = pageData?.data?.filter(
    (data) => data.slug === blogSection.pageDataLiveStyle,
  );
  const pageDataReviewProduct = pageData?.data?.filter(
    (data) => data.slug === blogSection.pageDataReviewProduct,
  );
  const pageDataTakeCare = pageData?.data?.filter(
    (data) => data.slug === blogSection.pageDataTakeCare,
  );

  return (
    <NesProductListLayout>
      <>
        <NesBlogTopTrending isPC={isPC} />
        {pageDataReviewProduct && (
          <NesBlogReviewProduct data={pageDataReviewProduct[0]} isPC={isPC} />
        )}
        {pageDataReviewProduct && (
          <NesBlogBeautyTips data={pageDataBeautyTips[0]} isPC={isPC} />
        )}
        {pageDataReviewProduct && (
          <NesBlogLiveStyle data={pageDataLiveStyle[0]} isPC={isPC} />
        )}
        {pageDataReviewProduct && (
          <NesBlogTakeCare data={pageDataTakeCare[0]} isPC={isPC} />
        )}
      </>
    </NesProductListLayout>
  );
};

export default Blog;
