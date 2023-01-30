import { BaseFactory } from "./base_factory";
import * as config from "@hera/config";

/**
 * Implement common crud methods for a model
 */
export class ObjectsFactory<T = unknown> extends BaseFactory<T> {
  /**
   * This method work as a constructor to build our common methods
   * It do nothing except return an instance of this class
   * This implement use to sold the typing problem
   * Did you remember how Django implement its model layer?
   * @param endpoint
   */
  static factory<T>({ endpoint }: { endpoint: string }) {
    return new BaseFactory<T>(endpoint, config.env.apiEndpoint);
  }
}
