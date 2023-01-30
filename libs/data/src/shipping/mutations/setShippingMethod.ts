import { useMutation } from "react-query";
import { ICart } from "../../cart";
import { IHttpError, IResponse } from "../../core";
import { IShippingMethodQuery } from "../models";
import { setShippingMethodService } from "../services";

export function useSetShippingMethod() {
  return useMutation<IResponse<ICart>, IHttpError, IShippingMethodQuery>(
    setShippingMethodService,
  );
}
