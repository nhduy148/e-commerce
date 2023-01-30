import { IHttpError } from "@hera/data";
import { FormatXMLElementFn, PrimitiveType } from "@hera/i18n";
import { devLog } from "@nestle/utils";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

export const useAddToCartErrorHandling = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  return function (
    error: IHttpError,
    productId: number,
    messageParams?: Record<
      string,
      PrimitiveType | FormatXMLElementFn<string, string>
    >,
    fallbackMessage?: string,
  ) {
    const ADD_TO_CART_ERROR_MESSAGES = {
      MAX_IN_CART: formatMessage({ id: "common.maxInCart" }, messageParams),
      MIN_IN_CART: formatMessage({ id: "common.minInCart" }, messageParams),
      QUANTITY_GREATER_ZERO: formatMessage(
        { id: "common.quantityGreaterZero" },
        messageParams,
      ),
      STOCK_INSUFFICIENT: formatMessage(
        { id: "common.stockInsufficient" },
        messageParams,
      ),
    };
    if (ADD_TO_CART_ERROR_MESSAGES?.[error.errorCode]) {
      enqueueSnackbar(ADD_TO_CART_ERROR_MESSAGES[error.errorCode], {
        variant: "error",
      });
    } else {
      enqueueSnackbar(
        fallbackMessage ||
          formatMessage({ id: "shoppingCart.addToCartFailure" }),
        {
          key: `addToCartFailure-${productId}`,
          variant: "error",
        },
      );
    }
    devLog(error);
  };
};
