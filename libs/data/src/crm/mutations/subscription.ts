import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import {
  ISubscribeSuccess,
  ISubscriptionPayload,
  Subscription,
} from "../models";

export function useSubscribeEmailMutation() {
  return useMutation<ISubscribeSuccess, IHttpError, ISubscriptionPayload>(
    (payload) => {
      return Subscription.subscribe(payload).then((res) => res.data);
    },
  );
}
