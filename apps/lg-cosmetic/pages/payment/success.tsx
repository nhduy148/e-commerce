import * as config from "@hera/config";
import { AuthenticationContext } from "@hera/contexts";
import { GET_AUTHENTICATED_CART, SHOPPING_CART_KEY } from "@hera/data";
import {
  LcPaymentLayout,
  LcPaymentSuccess as LcPaymentSuccessComponent,
} from "@lc/PaymentComponents";
import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

const LcPaymentSuccess = () => {
  const queryClient = useQueryClient();
  const { isLogin: isLoggedIn } = useContext(AuthenticationContext);
  const [lastPayment, setLastPayment] = useState<any>({ orderNumber: "" });

  useEffect(() => {
    (async () => {
      localStorage.removeItem(config.env.shoppingCartKey);
      queryClient.refetchQueries([
        isLoggedIn ? GET_AUTHENTICATED_CART : SHOPPING_CART_KEY,
      ]);
      setLastPayment(
        JSON.parse(
          localStorage?.getItem(config.env.lastPaymentKey) ||
            "{ orderNumber: ''}",
        ),
      );
    })();
  }, []);

  return (
    <LcPaymentLayout>
      <LcPaymentSuccessComponent orderNumber={lastPayment.orderNumber} />
    </LcPaymentLayout>
  );
};

export default LcPaymentSuccess;
