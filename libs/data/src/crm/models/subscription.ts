import { IResponse, ObjectsFactory } from "../../core";
import { Model } from "../../core/model";
import { SUBSCRIPTION_ENDPOINT } from "../../endpoint";

export interface ISubscriptionPayload {
  email: string;
}

export interface ISubscribeSuccess {
  msg: string;
}

export class Subscription extends Model {
  static config = { endpoint: "/subscription" };

  static objects = ObjectsFactory.factory<ISubscribeSuccess>(this.config);

  static subscribe(payload: ISubscriptionPayload) {
    return this.service.post<IResponse<ISubscribeSuccess>>({
      url: SUBSCRIPTION_ENDPOINT,
      payload,
    });
  }
}

Subscription.init(Subscription.config);
