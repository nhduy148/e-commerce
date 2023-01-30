import {
  ICategory,
  useCommonPageDataQuery,
  useListBrands,
  useListCategories,
} from "@hera/data";
import { ScrollToTopButton } from "@hera/ui";
import { Box, useTheme } from "@mui/material";
import { FC, memo, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { GSPFooter } from "./GSPFooter";
import { GSPHeader } from "./GSPHeader";
import { GSPSubscribe } from "./GSPSubscribe";
import { GSPTopBrands } from "./GSPTopBrands";

export interface IGSPLayoutProps {
  children?: React.ReactElement;
}

const GSPLayoutComponent: FC<IGSPLayoutProps> = ({ children }) => {
  const { palette } = useTheme();
  const ref = useRef<HTMLDivElement>();
  const [headerHeight, setHeaderHeight] = useState<number>(
    ref?.current?.clientHeight || 0,
  );
  const onChangeHeaderHeight = () => {
    if (ref.current?.clientHeight !== headerHeight) {
      setHeaderHeight(ref.current?.clientHeight || 155);
    }
  };

  const { data: commonPageData, isLoading: isPageLoading } =
    useCommonPageDataQuery();

  const { data: listBrands } = useListBrands();
  const { data: categoryResponse } = useListCategories();

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("resize", () => onChangeHeaderHeight());
    return () => {
      window.removeEventListener("resize", () => onChangeHeaderHeight());
    };
  }, []);

  useEffect(() => {
    if (!isPageLoading) {
      onChangeHeaderHeight();
    }
  }, [isPageLoading]);

  const listCategories: ICategory[] =
    categoryResponse?.categories?.root?.taxons || [];

  return (
    <Box style={{ position: "relative" }}>
      <GSPHeader
        menu={commonPageData?.categoryConfig}
        topBrands={commonPageData?.topBrandBanners || []}
        listBrands={listBrands || []}
        listCategories={listCategories || []}
        ref={ref}
        isLoading={isPageLoading}
      />
      <Box style={{ paddingTop: headerHeight }}>{children}</Box>
      <GSPTopBrands topBrandsData={commonPageData?.topBrandBanners} />
      <GSPSubscribe />
      <GSPFooter />
      <ScrollToTopButton />
    </Box>
  );
};

export const GSPLayout = memo(GSPLayoutComponent, isEqual);
