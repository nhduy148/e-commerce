import { AuthenticationContext } from "@hera/contexts";
import { useLoginFacebookCallback } from "@hera/data";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

const GoogleCallback = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const data = router.query.code as string;
  const { mutate } = useLoginFacebookCallback();
  const { onLogin } = useContext(AuthenticationContext);
  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    mutate(
      { code: data },
      {
        onError() {
          setLoginStatus(true);
        },
        async onSuccess(loginData) {
          setLoginStatus(false);
          const currentRoute = localStorage?.getItem("callbackRoute");
          const route = (currentRoute || "").includes("auth")
            ? "/"
            : currentRoute;
          onLogin(loginData, () => (window.location.href = route));
          localStorage?.removeItem("callbackRoute");
        },
      },
    );
  }, []);
  return (
    <Box>
      {!loginStatus ? (
        <Box></Box>
      ) : (
        <Container>
          <Box minHeight="40vh" display="flex">
            <Box m="auto">
              <Typography variant="h4" textAlign="center">
                {formatMessage({ id: "callbackPage.loginError" })}
              </Typography>

              <Typography variant="h5" textAlign="center"></Typography>
              <Typography variant="subtitle1" textAlign="center"></Typography>
              <Box display="flex" mt={1}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ margin: "auto" }}
                  onClick={(e) => {
                    router.push("/");
                  }}
                >
                  {formatMessage({ id: "callbackPage.home" })}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default GoogleCallback;
