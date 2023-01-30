import * as config from "@hera/config";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: config.env.sentryDSN,
  tracesSampleRate: 0.2,
});
