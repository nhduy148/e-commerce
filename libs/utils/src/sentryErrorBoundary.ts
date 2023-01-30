import { CHANNEL_CODE, currentEnv } from "@hera/config";
import { IHttpError } from "@hera/data";
import * as Sentry from "@sentry/nextjs";

type Params = {
  name: string;
  type: string;
  data?: object;
};

export function sentryErrorBoundary({ name, type, data = {} }: Params) {
  const transactionName = `${name} - enviroment: ${currentEnv.toUpperCase()}`;
  const transaction = Sentry.startTransaction({
    name: transactionName,
    data: { ...data },
  });
  return {
    captureException: (error: IHttpError) => {
      Sentry.captureException(error, (scope) => {
        scope.setSpan(transaction);
        scope.setTransactionName(transactionName);
        scope.setTag("hera_type", type);
        scope.setTag("hera_env", currentEnv.toUpperCase());
        scope.setTag("hera_channel", CHANNEL_CODE);
        scope.setTag("hera_error_code", error?.httpCode);
        return scope;
      });
    },
    end: () => {
      transaction.finish();
    },
  };
}
