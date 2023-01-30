import { AuthenticationContext } from "@hera/contexts";
import {
  GET_AUTHENTICATED_CART,
  IAddToCartPayload,
  SHOPPING_CART_KEY,
  useAddToCartMutation,
} from "@hera/data";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";
import { useAddToCartErrorHandling } from "./useAddToCartErrorHandling";

interface IAddToCartCallback {
  successCallback?: (data?: any) => void;
  errorCallback?: (err?: any) => void;
  finallyCallback?: () => void;
}

export type IAddToCartPayloadCallback = (
  payload: IAddToCartPayload,
  callback: IAddToCartCallback,
) => void;

export const useAddToCart = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { mutateAsync: addToCartAsync } = useAddToCartMutation();
  const queryClient = useQueryClient();
  const handlingAddToCartError = useAddToCartErrorHandling();
  const { isLogin } = useContext(AuthenticationContext);

  return async function (
    payload: IAddToCartPayload,
    callback: IAddToCartCallback = {},
    disableSuccessSnackbar?: boolean,
  ) {
    const { productId, quantity, minInCart, maxInCart, inStock } = payload;

    try {
      const data = await addToCartAsync({ quantity, productId });
      const key = isLogin ? GET_AUTHENTICATED_CART : SHOPPING_CART_KEY;
      queryClient.setQueryData(key, data);
      if (!disableSuccessSnackbar) {
        enqueueSnackbar(
          formatMessage({ id: "shoppingCart.addToCartSuccess" }),
          {
            key: `addToCartSuccess-${productId}`,
            variant: "success",
          },
        );
      }
      if (typeof callback?.successCallback === "function") {
        callback?.successCallback(data);
      }
    } catch (error) {
      handlingAddToCartError(error, productId, {
        minInCart: minInCart || 1,
        maxInCart: maxInCart || 1,
      });
      if (typeof callback?.errorCallback === "function") {
        callback?.errorCallback(error);
      }
    } finally {
      if (typeof callback?.finallyCallback === "function") {
        callback?.finallyCallback();
      }
    }
  };
};
