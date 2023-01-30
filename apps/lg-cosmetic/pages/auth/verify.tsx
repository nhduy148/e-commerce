import { IVerifyPayload, useVerifyUser } from "@hera/data";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

const verify = () => {
  const router = useRouter();
  const data = router.query as unknown as IVerifyPayload;

  const { formatMessage } = useIntl();

  const { mutate, isLoading } = useVerifyUser();
  const [isVerify, setIsVerify] = useState(true);
  useEffect(() => {
    mutate(
      { ...data },
      {
        onError() {
          setIsVerify(false);
        },
        onSuccess() {
          setIsVerify(true);
        },
      },
    );
  }, []);
  return (
    <Box minHeight="100vh">
      <Container>
        <Box mt={3.5}>
          <div>
            {isVerify ? (
              <Box>
                <Typography variant="h4">
                  {formatMessage({
                    id: "registerVerifyPage.verifySuccess",
                  })}
                </Typography>
                <Button variant="contained" onClick={() => router.push("/")}>
                  {formatMessage({
                    id: "registerVerifyPage.homePage",
                  })}
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h4">
                  {formatMessage({
                    id: "registerVerifyPage.accountVerified",
                  })}
                </Typography>
                <Button variant="contained" onClick={() => router.push("/")}>
                  {formatMessage({
                    id: "registerVerifyPage.homePage",
                  })}
                </Button>
              </Box>
            )}
          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default verify;
