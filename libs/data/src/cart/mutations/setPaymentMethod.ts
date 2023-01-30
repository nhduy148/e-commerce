import { useMutation } from "react-query";
import { ICart } from "../../cart";
import { IHttpError, IResponse } from "../../core";
import { IPaymentMethodQuery } from "../models";
import { setPaymentMethodService } from "../services";

export function useSetPaymentMethod() {
  return useMutation<IResponse<ICart>, IHttpError, IPaymentMethodQuery>(
    setPaymentMethodService,
  );
}
