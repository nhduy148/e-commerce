import { IProduct } from "@hera/data";
import { Image } from "@hera/ui";
import { toCurrency, validImageUrl } from "@hera/utils";
import { Box, Card, styled, Typography } from "@mui/material";
import { DefaultProductImage } from "@nestle/static/images";
import { useRouter } from "next/router";

interface IProps {
  product: IProduct;
}

const ClippedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1;
`;

const StyledSalePrice = styled(Typography)`
  text-decoration: line-through;
  margin-left: 4px;
  line-height: 1;
  color: ${({ theme }) => theme.palette.action.disabled};
`;

const StyledCard = styled(Card)`
  padding: 6px;
  transition: 300ms;
  cursor: pointer;
  :hover {
    box-shadow: ${({ theme }) => theme.shadows[1]};
  }
`;

export const NesSuggestProduct = ({ product }: IProps) => {
  let productImage: string;
  if (product?.images?.length) {
    productImage = product?.images.find((x) => x.isDefault)?.large;
  } else if (product?.defaultImage?.defaultProductUrl) {
    productImage = product?.defaultImage?.defaultProductUrl;
  }
  if (!validImageUrl(productImage)) {
    productImage = DefaultProductImage.src;
  }

  const haveDiscount: boolean = product?.sellingPrice < product?.maxRetailPrice;

  const { push } = useRouter();

  return (
    <StyledCard elevation={0} onClick={() => push(`/products/${product.slug}`)}>
      <Box display="flex" maxWidth={330}>
        <Box flex="1 1 72px">
          <Box paddingTop="100%" position="relative">
            <Image src={productImage} alt={product?.name} layout="fill" />
          </Box>
        </Box>
        <Box ml={1.5} flex="1 1 calc(100% - 72px)" overflow="hidden">
          <ClippedText color="primary" variant="caption">
            <b>{product?.brand?.name}</b>
          </ClippedText>
          <ClippedText
            sx={{
              mb: 0.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.name}
          </ClippedText>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">
              {toCurrency(product?.sellingPrice)}
            </Typography>
            {haveDiscount && (
              <StyledSalePrice variant="caption">
                {toCurrency(product?.maxRetailPrice)}
              </StyledSalePrice>
            )}
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
};
