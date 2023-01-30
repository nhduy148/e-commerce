import * as config from "@hera/config";
import {
  ILastPayment,
  IMomoPaymentStatusCode,
  IPaymentStatus,
  IProcessPaymentCallbackPayload,
  MomoPaymentStatus,
  useMomoPaymentCallback,
} from "@hera/data";
import { LcPaymentLayout, LcPaymentProcessing } from "@lc/PaymentComponents";
import { devLog } from "@lc/utils";
import { get } from "lodash-es";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MomoPaymentCallback() {
  const { mutateAsync: momoPaymentCallbackAsync } = useMomoPaymentCallback();
  const { push, query } = useRouter();

  useEffect(() => {
    const errorCode = get(query, "errorCode", "49") as IMomoPaymentStatusCode;
    const paymentId = get(query, "paymentId", null);
    const orderNumber = get(query, "orderNumber", null);
    const lastPayment: ILastPayment = JSON.parse(
      localStorage.getItem(config.env.lastPaymentKey),
    );
    if (
      MomoPaymentStatus.includes(errorCode) &&
      paymentId !== null &&
      lastPayment?.paymentId !== paymentId
    ) {
      const params = {};
      Object.entries(query).forEach(([key, value]) => {
        params[key] = value;
      });
      (async () => {
        try {
          await momoPaymentCallbackAsync(
            params as IProcessPaymentCallbackPayload,
          );
          const status: IPaymentStatus =
            errorCode === "0" ? "success" : "failed";
          if (status === "success") {
            localStorage.removeItem(config.env.shoppingCartKey);
          }
          localStorage.setItem(
            config.env.lastPaymentKey,
            JSON.stringify({
              orderNumber,
              paymentId,
              status,
            }),
          );
          await push(`/payment/${status}`);
        } catch (error) {
          devLog("Payment callback error", error);
        }
      })();
    } else {
      push("/");
    }
  }, []);

  return (
    <LcPaymentLayout>
      <LcPaymentProcessing />
    </LcPaymentLayout>
  );
}
