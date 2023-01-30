import * as config from "@hera/config";
import {
  BaoKimPaymentStatus,
  IBaoKimPaymentStatusCode,
  ILastPayment,
  IPaymentStatus,
} from "@hera/data";
import {
  NesPaymentLayout,
  NesPaymentProcessing,
} from "@nestle/PaymentComponents";
import { get } from "lodash-es";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function BaoKimPaymentCallback() {
  const { push, query } = useRouter();

  useEffect(() => {
    const stat = get(query, "stat", null) as IBaoKimPaymentStatusCode;
    const paymentId = get(query, "paymentId", null);
    const orderNumber = get(query, "orderNumber", null);
    const lastPayment: ILastPayment = JSON.parse(
      localStorage.getItem(config.env.lastPaymentKey),
    );
    if (
      BaoKimPaymentStatus.includes(stat) &&
      paymentId !== null &&
      lastPayment?.paymentId !== paymentId
    ) {
      const status: IPaymentStatus =
        stat === "c" || stat === "r" || stat === "p" ? "success" : "failed";
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
      push(`/payment/${status}`);
    } else {
      push("/");
    }
  }, []);

  return (
    <NesPaymentLayout>
      <NesPaymentProcessing />
    </NesPaymentLayout>
  );
}
