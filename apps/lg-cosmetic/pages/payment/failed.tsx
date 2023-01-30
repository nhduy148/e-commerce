import {
  LcPaymentFailed as LcPaymentFailedComponent,
  LcPaymentLayout,
} from "@lc/PaymentComponents";

const LcPaymentFailed = () => {
  return (
    <LcPaymentLayout>
      <LcPaymentFailedComponent />
    </LcPaymentLayout>
  );
};

export default LcPaymentFailed;
