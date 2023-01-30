import StaticImage from "@gsp/static/images";
import { IProduct, IProductImage } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { ProductImage } from "@hera/ui";
import { Box, BoxProps } from "@mui/material";
import { memo, useMemo } from "react";
import isEqual from "react-fast-compare";

interface Props {
  product: IProduct;
  children?: JSX.Element;
  WrapperProps?: BoxProps;
}

const GSPProductImageComponent = ({
  product,
  children,
  WrapperProps,
}: Props) => {
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
        borderRadius: 1.25,
        overflow: "hidden",
        bgcolor: "grey.200",
      }}
    >
      <ProductImage
        source={productImage}
        fallback={StaticImage.DefaultProductImage.src}
        alt={product.name || __({ defaultMessage: "Quà tặng miễn phí" })}
      />
      {children}
    </Box>
  );
};

export const GSPProductImage = memo(GSPProductImageComponent, isEqual);
