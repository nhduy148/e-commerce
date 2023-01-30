import { IHttpError, ILineItem } from "@hera/data";
import { toCurrency } from "@hera/utils";
import { LcIconButton, LcInputNumber, LcProductImage } from "@lc/components";
import {
  Box,
  Button,
  CircularProgress,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const ClippedText = styled(Typography)`
  white-space: nowrap;
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
  cartItem: ILineItem;
  onQuantityChange?: (
    lineItem: ILineItem,
    quantity: number,
    successCallback?: (data?: any) => void,
    errorCallback?: (error?: IHttpError) => void,
    finallyCallback?: () => void,
  ) => void;
  onTextingQuantity?: (lineItem?: ILineItem, quantity?: number) => void;
  onDeleteItem?: (lineItem: ILineItem, callback?: () => void) => void;
}

export const LcShoppingCartItem: FC<IProps> = ({
  cartItem,
  onTextingQuantity,
  onQuantityChange,
  onDeleteItem,
}) => {
  const { palette, typography } = useTheme();
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
  };
  const [nextQuantity, setNextQuantity] = useState<number>(quantity | 0);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleQuantityChange = (type: "+" | "-") => {
    if (type == "+") {
      if (product?.maxInCart < quantity + 1) {
        return;
      }
      setIsAdding(true);
      setNextQuantity(quantity + 1);
      onQuantityChange(
        cartItem,
        +1,
        () => {},
        () => setNextQuantity(quantity),
        () => setIsAdding(false),
      );
    } else {
      if (quantity - 1 === 0) {
        onDeleteItem(cartItem);
        return;
      }
      setIsAdding(true);
      setNextQuantity(quantity - 1);
      onQuantityChange(
        cartItem,
        -1,
        () => {},
        () => setNextQuantity(quantity),
        () => setIsAdding(false),
      );
    }
  };

  const handleInputQuantityChange = (value) => {
    setNextQuantity(value);
    if (typeof onTextingQuantity === "function") {
      onTextingQuantity(cartItem, value);
    }
  };

  const handleInputQuantityBlur = () => {
    if (nextQuantity === quantity) {
      return;
    }
    setIsAdding(true);
    onQuantityChange(
      cartItem,
      nextQuantity - quantity,
      () => {},
      () => setNextQuantity(quantity),
      () => setIsAdding(false),
    );
  };

  const isValidProduct = cartItem?.isOrderable || false;

  const maxAddQuantity = useMemo(() => {
    if (product?.inStock < product?.maxInCart) {
      return cartItem.product.inStock;
    }
    return cartItem.product.maxInCart;
  }, [cartItem.product]);

  const updateValidQuantity = () => {
    if (product?.inStock <= 0) {
      onDeleteItem(cartItem);
      return;
    }
    onQuantityChange(
      cartItem,
      maxAddQuantity - quantity,
      () => setNextQuantity(quantity + (maxAddQuantity - quantity)),
      () => {},
      () => setIsAdding(false),
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
          <LcProductImage product={product} size="small" />
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
              {toCurrency(cartItem?.totalPriceFinal)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1}>
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

              <LcInputNumber
                sx={{
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
                disabled={
                  maxAddQuantity <= nextQuantity || isAdding || !isValidProduct
                }
              >
                <b>+</b>
              </StyledSpinnerButton>
            </Box>
            {!isValidProduct && (
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
        </Box>
        <Box flex="1 1 28px">
          <LcIconButton
            iconName="close"
            onClick={() => onDeleteItem(cartItem)}
          />
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
