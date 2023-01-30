import NextErrorComponent from "next/error";

import { useBreakPoint } from "@gsp/hooks";
import { useFormatter } from "@hera/i18n";
import { Box, Button, Container, Typography } from "@mui/material";
import * as Sentry from "@sentry/nextjs";
import type { NextPage } from "next";
import { NextPageContext } from "next";
import type { ErrorProps } from "next/error";
import { useRouter } from "next/router";

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
  const { __ } = useFormatter();

  const pageContent = {
    404: {
      message: `${__({
        defaultMessage: "Không tìm thấy nội dung đang tìm kiếm!",
      })}`,
      subMessage: `${__({
        defaultMessage:
          "Xin lỗi, nội dung bạn đang tìm kiếm hiện không tồn tại. Vui lòng truy cập trang chủ để tìm kiếm nhiều nội dung hơn.",
      })}`,
    },
    500: {
      message: `${__({
        defaultMessage: "Không tìm thấy nội dung đang tìm kiếm!",
      })}`,
      subMessage: `${__({
        defaultMessage:
          "Xin lỗi, nội dung bạn đang tìm kiếm hiện không tồn tại. Vui lòng truy cập trang chủ để tìm kiếm nhiều nội dung hơn.",
      })}`,
    },
  };

  return (
    <Container>
      <Box minHeight={isPC ? "50vh" : "40vh"} display="flex">
        <Box m="auto" py={5}>
          <Typography variant="h1" textAlign="center">
            {statusCode}
          </Typography>

          <Typography variant="h4" textAlign="center">
            {pageContent[statusCode].message}
          </Typography>
          <Typography variant="subtitle1" textAlign="center">
            {pageContent[statusCode].subMessage}
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
              {__({ defaultMessage: "Quay về Trang Chủ" })}
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
