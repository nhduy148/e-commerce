import {
  ICategory,
  ICommonPageData,
  useCommonPageDataQuery,
  useListBrands,
  useListCategories,
} from "@hera/data";
import { ScrollToTopButton } from "@hera/ui";
import { LcTopBanner } from "@lc/components";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, memo, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { LcFooter } from "./LcFooter";
import { LcHeader } from "./LcHeader";
import { LcTopBrand } from "./LcTopBrand";

export interface ILCLayoutProps {
  children?: React.ReactElement;
}

const LcLayoutComponent: FunctionComponent<ILCLayoutProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>();
  const router = useRouter();
  const topBannerRef = useRef<HTMLDivElement>();
  const [headerHeight, setHeaderHeight] = useState<number>(
    ref?.current?.clientHeight || 0,
  );

  const onChangeHeaderHeight = () => {
    const topBannerHeight =
      router.pathname === "/" ? topBannerRef?.current?.clientHeight || 100 : 0;

    let _headerHeight = ref.current?.clientHeight;
    // @ts-ignore
    if (!window?.megaMenuPositionTop || router.pathname !== "/") {
      _headerHeight += topBannerHeight;
    }
    if (headerHeight !== _headerHeight) {
      setHeaderHeight(_headerHeight);
    }
    // @ts-ignore
    if (_headerHeight !== window.megaMenuPositionTop) {
      // @ts-ignore
      window.megaMenuPositionTop = _headerHeight || 206;
    }
  };

  const {
    data: commonPageData,
    isLoading: isPageLoading,
  }: { data: ICommonPageData; isLoading: boolean } = useCommonPageDataQuery();
  const { data: listBrands } = useListBrands();
  const { data: categoryResponse } = useListCategories();

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("mousemove", onChangeHeaderHeight);
    window.addEventListener("scroll", onChangeHeaderHeight);
    window.addEventListener("resize", onChangeHeaderHeight);
    return () => {
      window.removeEventListener("mousemove", onChangeHeaderHeight);
      window.removeEventListener("scroll", onChangeHeaderHeight);
      window.removeEventListener("resize", onChangeHeaderHeight);
    };
  }, []);

  useEffect(() => {
    onChangeHeaderHeight();
  }, [isPageLoading]);

  const listCategories: ICategory[] =
    categoryResponse?.categories?.root?.taxons || [];

  return (
    <>
      <LcHeader
        menu={commonPageData?.categoryConfig}
        hasTopBanner={router.pathname === "/"}
        topBannerComponent={
          // @ts-ignore
          <LcTopBanner ref={topBannerRef} data={commonPageData} />
        }
        topBrands={commonPageData?.topBrandBanners || []}
        listBrands={listBrands || []}
        listCategories={listCategories || []}
        ref={ref}
        isLoading={isPageLoading}
      />

      <Box style={{ paddingTop: headerHeight }}>{children}</Box>
      <LcTopBrand data={commonPageData?.topBrandBanners} />
      <LcFooter />
      <ScrollToTopButton />
    </>
  );
};

export const LcLayout = memo(LcLayoutComponent, isEqual);
