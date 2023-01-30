import * as Sentry from "@sentry/nextjs";
import { env } from "./libs/config/src/index";

Sentry.init({
  dsn: env.sentryDSN,
  tracesSampleRate: 0.2,
});
