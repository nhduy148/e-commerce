import { Service } from "./service";
import * as config from "@hera/config";

interface IFactoryParams {
  endpoint: string;
}

/**
 * Core model, every model extend this class have a static init method use to implement http service adapter,
 * that's all
 */
export class Model {
  static service: Service;

  static init({ endpoint }: IFactoryParams) {
    this.service = new Service({
      endpoint,
      baseUrl: config.env.apiEndpoint,
    });
  }
}
