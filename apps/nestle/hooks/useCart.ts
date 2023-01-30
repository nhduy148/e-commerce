import { AuthenticationContext } from "@hera/contexts";
import { useAuthenticatedCart, useShoppingCart } from "@hera/data";
import { useContext } from "react";

export const useCart = () => {
  const { isLogin } = useContext(AuthenticationContext);
  const { data: unAuthenCartData, ...restUnAuthenCart } = useShoppingCart();
  const { data: authenCartData, ...restAuthenCart } = useAuthenticatedCart();

  if (isLogin) {
    return { data: authenCartData?.data, ...restAuthenCart };
  }
  return { data: unAuthenCartData?.data, ...restUnAuthenCart };
};
