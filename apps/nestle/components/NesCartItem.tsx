import { ILineItem } from "@hera/data";
import { toCurrency } from "@hera/utils";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  NesIconButton,
  NesInputNumber,
  NesProductImage,
} from "@nestle/components";
import { IAddToCartPayloadCallback } from "@nestle/hooks";
import { FC, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const ClippedText = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
`;

const StyledSpinnerButton = styled(Button)`
  min-width: auto;
  flex: "1 1 32px";
  padding: 0;
  line-height: 1;
  height: 32px;
  width: 32px;
`;

interface IProps {
  lineItem: ILineItem;
  type?: "checkout" | "shoppingCart";
  onQuantityChange?: IAddToCartPayloadCallback;
  onDeleteItem?: (lineItem: ILineItem, callback?: () => void) => void;
  enableCheckoutItemAdjustment?: boolean;
}

const NesCartItem: FC<IProps> = ({
  lineItem,
  type,
  enableCheckoutItemAdjustment,
  onQuantityChange,
  onDeleteItem,
}) => {
  const { palette, typography } = useTheme();
  const { quantity, product } = lineItem;
  const { formatMessage } = useIntl();
  const [nextQuantity, setNextQuantity] = useState<number>(quantity | 0);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    setNextQuantity(quantity);
  }, [quantity]);

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
  };

  const handleQuantityChange = (type: "+" | "-") => {
    if (type == "+") {
      if (product?.maxInCart < quantity + 1) {
        return;
      }
      setIsAdding(true);
      setNextQuantity(quantity + 1);
      onQuantityChange(
        { ...lineItem, quantity: +1 },
        {
          errorCallback: () => setNextQuantity(quantity),
          finallyCallback: () => setIsAdding(false),
        },
      );
    } else {
      if (quantity - 1 === 0) {
        onDeleteItem(lineItem);
        return;
      }
      setIsAdding(true);
      setNextQuantity(quantity - 1);
      onQuantityChange(
        { ...lineItem, quantity: -1 },
        {
          errorCallback: () => setNextQuantity(quantity),
          finallyCallback: () => setIsAdding(false),
        },
      );
    }
  };

  const handleInputQuantityChange = (value) => {
    setNextQuantity(value);
  };

  const handleInputQuantityBlur = () => {
    if (nextQuantity === quantity) {
      return;
    }
    setIsAdding(true);
    onQuantityChange(
      { ...lineItem, quantity: nextQuantity - quantity },
      {
        errorCallback: () => setNextQuantity(quantity),
        finallyCallback: () => setIsAdding(false),
      },
    );
  };

  const isValidProduct = lineItem?.isOrderable || false;

  const maxAddQuantity = useMemo(() => {
    if (product?.inStock < product?.maxInCart) {
      return lineItem.product.inStock;
    }
    return lineItem.product.maxInCart;
  }, [lineItem.product]);

  const updateValidQuantity = () => {
    if (product?.inStock <= 0) {
      onDeleteItem(lineItem);
      return;
    }
    onQuantityChange(
      { ...lineItem, quantity: maxAddQuantity - quantity },
      {
        errorCallback: () => setNextQuantity(quantity),
        finallyCallback: () => setIsAdding(false),
      },
    );
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

  const renderSpinner = (
    <Box
      display="flex"
      minWidth={96}
      maxWidth={96}
      sx={{
        pointerEvents: isValidProduct ? "auto" : "none",
        opacity: isValidProduct ? 1 : 0.3,
      }}
    >
      <StyledSpinnerButton
        size="large"
        variant="text"
        color="inherit"
        onClick={() => !isAdding && handleQuantityChange("-")}
        disabled={!isValidProduct || nextQuantity <= 1 || isAdding}
      >
        <b>-</b>
      </StyledSpinnerButton>

      <NesInputNumber
        sx={{
          borderRadius: "4px",
          height: 32,
          padding: 0.5,
          flex: "0 1 32px",
          color: "primary.main",
          border: "1px solid",
          borderColor: "primary.main",
          fontSize: typography.overline,
          fontWeight: typography.fontWeightBold,
          ":before, :after": {
            content: "none",
          },
        }}
        inputProps={{
          sx: {
            lineHeight: 1,
            "&.Mui-disabled": {
              color: "primary.main",
              "-webkit-text-fill-color": "unset",
              opacity: 0.5,
            },
          },
        }}
        min={1}
        value={nextQuantity}
        max={maxAddQuantity}
        disabled={isAdding || !isValidProduct}
        onBlur={!isAdding && isValidProduct && handleInputQuantityBlur}
        onChange={handleInputQuantityChange}
      />

      <StyledSpinnerButton
        color="inherit"
        variant="text"
        onClick={() => !isAdding && handleQuantityChange("+")}
        disabled={maxAddQuantity <= nextQuantity || isAdding || !isValidProduct}
      >
        <b>+</b>
      </StyledSpinnerButton>
    </Box>
  );

  if (type === "checkout") {
    return (
      <Box position="relative">
        {isAdding && (
          <Box
            sx={{
              position: "absolute",
              zIndex: 2,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":before": {
                content: "''",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: palette.common.black,
                opacity: 0.3,
              },
            }}
          >
            <CircularProgress size={30} />
          </Box>
        )}
        <Stack spacing={1} p={2}>
          <Box display="flex" maxWidth={1}>
            <Box
              sx={{
                flex: "0 1 70px",
                minWidth: 70,
                position: "relative",
                paddingRight: "6px",
              }}
            >
              <NesProductImage
                product={lineItem?.product}
                WrapperProps={{ height: 64, width: 64 }}
              />
            </Box>
            <Box flex="1 1 auto">
              <Tooltip title={product.name}>
                <ClippedText
                  sx={{ mb: 0.5, "-webkit-line-clamp": "2" }}
                  variant="body2"
                >
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
          {enableCheckoutItemAdjustment && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box display="flex" alignItems="center">
                {renderSpinner}
              </Box>
              <NesIconButton
                iconName="delete"
                size="small"
                onClick={() => onDeleteItem(lineItem)}
              />
            </Box>
          )}

          {enableCheckoutItemAdjustment &&
            (!isValidProduct || renderMessage().length > 0) && (
              <Box>
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                  onClick={updateValidQuantity}
                >
                  <Typography variant="overline">
                    {translate.updateQuantityProduct}
                  </Typography>
                </Button>
              </Box>
            )}
          {renderMessage().length > 0 && (
            <Box>
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
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: 1,
          py: 1.5,
          position: "relative",
        }}
      >
        {isAdding && (
          <Box
            sx={{
              position: "absolute",
              zIndex: 2,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":before": {
                content: "''",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: palette.common.black,
                opacity: 0.3,
              },
            }}
          >
            <CircularProgress size={30} />
          </Box>
        )}
        <Box flex="1 1 100px">
          <NesProductImage product={lineItem?.product} />
        </Box>
        <Box flex="1 1 100%" px={1} overflow="hidden">
          <ClippedText variant="overline" color="primary.main">
            {product?.brand?.name}
          </ClippedText>
          <ClippedText variant="body2">{product?.name}</ClippedText>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">
              {toCurrency(lineItem?.totalPriceFinal)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1}>
            {renderSpinner}
          </Box>
        </Box>
        <Box flex="1 1 28px">
          <NesIconButton
            iconName="close"
            onClick={() => onDeleteItem(lineItem)}
          />
        </Box>
      </Box>
      <Box pb={0.5}>
        {(!isValidProduct || renderMessage().length > 0) && (
          <Button
            variant="text"
            size="small"
            color="primary"
            onClick={updateValidQuantity}
          >
            <Typography variant="overline">
              {translate.updateQuantityProduct}
            </Typography>
          </Button>
        )}
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

NesCartItem.defaultProps = {
  type: "shoppingCart",
  enableCheckoutItemAdjustment: true,
};

export { NesCartItem };
