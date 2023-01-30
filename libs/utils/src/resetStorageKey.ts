import * as config from "@hera/config";

export const resetStorageKey = () => {
  localStorage?.removeItem(config.env.authKey);
  localStorage?.removeItem(config.env.shoppingCartKey);
};
