import NextErrorComponent from "next/error";

import { Box, Button, Container, Typography } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import * as Sentry from "@sentry/nextjs";
import type { NextPage } from "next";
import { NextPageContext } from "next";
import type { ErrorProps } from "next/error";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

const ErrorPage: NextPage<AppErrorProps> = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err);
    // Flushing is not required in this case as it only happens on the client
  }
  const router = useRouter();
  const isPC = useBreakPoint("sm");
  const { formatMessage } = useIntl();
  const translate = {
    content1: formatMessage({ id: "errorPage.content1" }),
    content2: formatMessage({ id: "errorPage.content2" }),
    homePage: formatMessage({ id: "errorPage.home" }),
  };
  return (
    <Container>
      <Box minHeight={isPC ? "50vh" : "40vh"} display="flex">
        <Box m="auto" py={5}>
          <Typography variant="h1" textAlign="center">
            {statusCode}
          </Typography>

          <Typography variant="h5" textAlign="center">
            {translate.content1}
          </Typography>
          <Typography variant="subtitle1" textAlign="center">
            {translate.content2}
          </Typography>
          <Box display="flex" mt={1}>
            <Button
              size="small"
              variant="contained"
              sx={{ margin: "auto" }}
              onClick={(e) => {
                router.push("/");
              }}
            >
              {translate.homePage}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

ErrorPage.getInitialProps = async (ctx: NextPageContext) => {
  const errorInitialProps: AppErrorProps =
    await NextErrorComponent.getInitialProps(ctx);

  errorInitialProps.hasGetInitialPropsRun = true;

  if (ctx?.err) {
    Sentry.captureException(ctx?.err);

    await Sentry.flush(2000);

    return errorInitialProps;
  }

  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${ctx.asPath}`),
  );

  await Sentry.flush(2000);

  return errorInitialProps;
};

export default ErrorPage;
