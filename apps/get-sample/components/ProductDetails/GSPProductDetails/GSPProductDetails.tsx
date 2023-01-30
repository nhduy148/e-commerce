import {
  GSPProductDetailsDesktop,
  GSPProductDetailsMobile,
} from "@gsp/components";
import { useBreakPoint } from "@gsp/hooks";
import { IProductDetail } from "@hera/data";
import { FC, memo } from "react";
import isEqual from "react-fast-compare";

export interface IProductDetailsProps {
  productDetail: IProductDetail;
  isLoading?: boolean;
}

const GSPProductDetailsComponent: FC<IProductDetailsProps> = ({
  productDetail,
  isLoading,
}) => {
  const isPC = useBreakPoint("sm");

  return (
    <>
      {isPC ? (
        <GSPProductDetailsDesktop
          productDetail={productDetail}
          isLoading={isLoading}
        />
      ) : (
        <GSPProductDetailsMobile
          productDetail={productDetail}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export const GSPProductDetails = memo(GSPProductDetailsComponent, isEqual);
