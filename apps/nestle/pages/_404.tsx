import { Box, Button, Container, Typography } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

type Props = {};

const ErrorPage = (props: Props) => {
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
        <Box m="auto">
          <Typography variant="h1" textAlign="center">
            404
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

export default ErrorPage;
