import { ILineItem } from "@hera/data";
import { toCurrency } from "@hera/utils";
import { LcProductImage } from "@lc/components";
import { Box, styled, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";

interface IProps {
  lineItem: ILineItem;
}

const ClippedText = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const LcCheckoutProductItem = ({ lineItem }: IProps) => {
  const { product, quantity } = lineItem;

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
  };

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
      <Box display="flex" pt={2} maxWidth={1}>
        <Box
          sx={{
            flex: "1 1 70px",
            minWidth: 70,
            maxWidth: 70,
            position: "relative",
            paddingRight: "6px",
          }}
        >
          <LcProductImage
            product={lineItem?.product}
            WrapperProps={{ height: 64, width: 64 }}
            size="small"
          />
        </Box>
        <Box flex="1 1 auto">
          <Tooltip title={product.name}>
            <ClippedText sx={{ mb: 0.5 }} variant="body2">
              <b>{product.name}</b>
            </ClippedText>
          </Tooltip>
          <Typography variant="body2">{`x ${quantity}`}</Typography>
        </Box>
        <Box flex="0 1 auto">
          <Typography variant="body2">
            {toCurrency(lineItem?.totalPriceFinal) || 0}
          </Typography>
        </Box>
      </Box>
      <Box pb={2}>
        {renderMessage().map((message) => (
          <Typography
            variant="overline"
            color="error.main"
            textTransform="none"
          >
            * {message}
          </Typography>
        ))}
      </Box>
    </>
  );
};
