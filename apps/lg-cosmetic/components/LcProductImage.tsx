import { IProduct, IProductImage } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { ProductImage } from "@hera/ui";
import { DefaultProductImage } from "@lc/static/images";
import { Box, BoxProps } from "@mui/material";
import { FC, memo, useMemo } from "react";
import isEqual from "react-fast-compare";

interface IProps {
  product: IProduct;
  children?: JSX.Element;
  WrapperProps?: BoxProps;
  size?: keyof IProductImage;
}

const LcProductImageComponent: FC<IProps> = ({
  product,
  children,
  WrapperProps,
  size,
}) => {
  const { __ } = useFormatter();
  const productImage: IProductImage = useMemo(
    () => product?.images.find((x) => x.isDefault),
    [product?.images],
  );

  return (
    <Box
      {...WrapperProps}
      sx={{
        ...WrapperProps?.sx,
        position: "relative",
        paddingTop: "100%",
        overflow: "hidden",
        bgcolor: "common.white",
      }}
    >
      <ProductImage
        source={productImage}
        fallback={DefaultProductImage.src}
        alt={product.name || __({ defaultMessage: "LG Vina Cosmetic product" })}
      />
      {children}
    </Box>
  );
};

LcProductImageComponent.defaultProps = {
  size: "large",
};

export const LcProductImage = memo(LcProductImageComponent, isEqual);
