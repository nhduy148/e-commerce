import { ILineItem } from "@hera/data";
import { Image } from "@hera/ui";
import { validImageUrl } from "@hera/utils";
import { DefaultProductImage } from "@lc/static/images";
import { Box, styled, Typography } from "@mui/material";
import { FC } from "react";
import { useIntl } from "react-intl";

const ClippedText = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
`;

interface IProps {
  cartItem: ILineItem;
}

export const LcGiftItem: FC<IProps> = ({ cartItem }) => {
  const { quantity, product } = cartItem;
  const { formatMessage } = useIntl();
  const translate = {
    inStock: formatMessage({ id: "validations.checkout.inStock" }, {}),
    minInCart: formatMessage(
      { id: "validations.checkout.minInCart" },
      { minInCart: product?.minInCart },
    ),
    maxInCart: formatMessage(
      { id: "validations.checkout.maxInCart" },
      { maxInCart: product?.maxInCart },
    ),
    outOfStock: formatMessage({ id: "validations.checkout.outOfStock" }, {}),
    updateQuantityProduct: formatMessage({
      id: "shoppingCart.updateQuantityProduct",
    }),
    gift: formatMessage({ id: "common.gift" }),
  };

  let productImage: string;
  if (product?.images?.length) {
    productImage = product?.images.find((x) => x.isDefault)?.large;
  } else if (product?.defaultImage?.defaultProductUrl) {
    productImage = product?.defaultImage?.defaultProductUrl;
  }
  if (!validImageUrl(productImage)) {
    productImage = DefaultProductImage.src;
  }

  const renderMessage = () => {
    let message: string[];
    if (product?.inStock <= 0) {
      message = [translate.outOfStock];
    } else {
      const messages = {
        inStock: quantity > product?.inStock,
        minInCart: quantity < product?.minInCart,
        maxInCart: quantity > product?.maxInCart,
      };
      message = Object.entries(messages)
        .filter(([_, value]) => Boolean(value))
        .map(([key]) => translate[key]);
    }
    return message;
  };

  return (
    <>
      <Box display="flex">
        <Box flex="1 1 44px">
          <Box position="relative" paddingTop="100%">
            <Image
              src={productImage}
              alt={product?.name}
              layout="fill"
              fallbackImage={DefaultProductImage}
            />
          </Box>
        </Box>
        <Box flex="1 1 100%" px={1} overflow="hidden">
          <Box
            px={0.5}
            py={0.25}
            border="1px solid"
            borderColor="primary.main"
            display="inline-flex"
          >
            <Typography
              variant="overline"
              color="primary.main"
              lineHeight={1}
              display="block"
            >
              {translate.gift}
            </Typography>
          </Box>
          <ClippedText variant="body2">{product?.name}</ClippedText>
        </Box>
        <Box flex="1 1 auto">
          <Typography variant="body2">x{quantity}</Typography>
        </Box>
      </Box>
      {renderMessage().map((message) => (
        <Typography
          variant="overline"
          color="error.main"
          textTransform="none"
          sx={{ display: "block", mb: 0.5 }}
        >
          * {message}
        </Typography>
      ))}
    </>
  );
};
