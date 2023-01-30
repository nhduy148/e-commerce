import { AuthenticationContext } from "@hera/contexts";
import {
  GET_AUTHENTICATED_CART,
  IProduct,
  IProductDetail,
  SHOPPING_CART_KEY,
  useAddToCartMutation,
} from "@hera/data";
import { gtmEvent, metaPixelEvent } from "@lc/libs";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";
import { useAddToCartErrorHandling } from "./useAddToCartErrorHandling";

export interface IAddToCartCallback {
  successCallback?: (data?: any) => void;
  errorCallback?: (err?: any) => void;
  finallyCallback?: () => void;
}
export const useAddToCart = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { mutateAsync: addToCartAsync } = useAddToCartMutation();
  const queryClient = useQueryClient();
  const handlingAddToCartError = useAddToCartErrorHandling();
  const { isLogin } = useContext(AuthenticationContext);

  return async function (
    {
      product,
      quantity,
    }: { product: IProduct | IProductDetail; quantity: number },
    {
      successCallback,
      errorCallback,
      finallyCallback,
    }: IAddToCartCallback = {},
    disableSuccessSnackbar?: boolean,
  ) {
    if (!product?.id) {
      throw new Error("Missing {productId}");
    }

    gtmEvent("add_to_cart", { ...product, quantity });
    metaPixelEvent("AddToCart", { ...product, quantity });

    try {
      const data = await addToCartAsync({
        quantity,
        productId: product?.id,
      });
      const key = isLogin ? GET_AUTHENTICATED_CART : SHOPPING_CART_KEY;
      queryClient.setQueryData(key, data);
      if (!disableSuccessSnackbar) {
        enqueueSnackbar(
          formatMessage({ id: "shoppingCart.addToCartSuccess" }),
          {
            key: `addToCartSuccess-${product?.id}`,
            variant: "success",
          },
        );
      }
      if (typeof successCallback === "function") {
        successCallback(data);
      }
    } catch (error) {
      handlingAddToCartError(error, product?.id, {
        minInCart: product?.minInCart || 1,
        maxInCart: product?.maxInCart || 1,
      });
      if (typeof errorCallback === "function") {
        errorCallback(error);
      }
    } finally {
      if (typeof finallyCallback === "function") {
        finallyCallback();
      }
    }
  };
};
