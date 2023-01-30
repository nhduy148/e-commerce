import {
  NesPaymentFailed as NesPaymentFailedComponent,
  NesPaymentLayout,
} from "@nestle/PaymentComponents";

const NesPaymentFailed = () => {
  return (
    <NesPaymentLayout>
      <NesPaymentFailedComponent />
    </NesPaymentLayout>
  );
};

export default NesPaymentFailed;
