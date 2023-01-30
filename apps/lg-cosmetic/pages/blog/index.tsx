import { useGetBlogPageData } from "@hera/data";
import {
  LcBlogBeautyTips,
  LcBlogLiveStyle,
  LcBlogReviewProduct,
  LcBlogTakeCare,
  LcBlogTopTrending,
} from "@lc/BlogComponent";
import { useBreakPoint } from "@lc/hooks";
import { blogSection } from "@lc/types";
import LcProductListLayout from "apps/lg-cosmetic/components/LcProductListLayout";

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
    <LcProductListLayout setBanner={false}>
      <>
        <LcBlogTopTrending isPC={isPC} />
        {pageDataReviewProduct && (
          <LcBlogReviewProduct data={pageDataReviewProduct[0]} isPC={isPC} />
        )}
        {pageDataReviewProduct && (
          <LcBlogBeautyTips data={pageDataBeautyTips[0]} isPC={isPC} />
        )}
        {pageDataReviewProduct && (
          <LcBlogLiveStyle data={pageDataLiveStyle[0]} isPC={isPC} />
        )}
        {pageDataReviewProduct && (
          <LcBlogTakeCare data={pageDataTakeCare[0]} isPC={isPC} />
        )}
      </>
    </LcProductListLayout>
  );
};

export default Blog;
