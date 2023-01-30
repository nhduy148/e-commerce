import { AuthenticationContext } from "@hera/contexts";
import {
  useLoginFacebook,
  useLoginGoogle,
  useLoginPasswordMutation,
} from "@hera/data";
import { AuthenticationAlert, Image, PasswordField } from "@hera/ui";
import { FacebookLogo, GoogleLogo } from "@lc/static/images";
import { loginInitialValues, loginValidations } from "@lc/validations";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  IconButton,
  keyframes,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";

import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { IAuthenticationModalProps } from "../types";
import { LcFormHelperText } from "./LcFormHelperText";

interface Props extends IAuthenticationModalProps {
  onGoToRegister?: (e: Event) => void;
  onGoToForgotPassword?: (e: Event) => void;
}

const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to { opacity: 1;}
`;

const LcLoginModalComponent = ({
  onClose,
  onGoToRegister,
  onGoToForgotPassword,
  img,
}: Props) => {
  const { formatMessage } = useIntl();
  const { mutate, isLoading } = useLoginPasswordMutation();
  const { mutate: loginGoogleMutate } = useLoginGoogle();
  const { mutate: loginFacebookMutate } = useLoginFacebook();
  const { onLogin } = useContext(AuthenticationContext);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const translate = {
    login: formatMessage({ id: "authentication.login" }),
    quickLogin: formatMessage({ id: "authentication.quickLogin" }),
    or: formatMessage({ id: "authentication.or" }),
    password: formatMessage({ id: "authentication.password" }),
    loginFail: formatMessage({ id: "authentication.loginFail" }),
    haveAccount: formatMessage({ id: "authentication.haveAccount" }),
    registerNow: formatMessage({ id: "authentication.registerNow" }),
    forgotPassword: formatMessage({ id: "authentication.forgotPassword" }),
    loginSuccess: formatMessage({ id: "authentication.loginSuccess" }),
  };
  const handleSubmit = async (values) => {
    mutate(
      { ...values },
      {
        onError() {
          setError(true);
        },
        async onSuccess(data) {
          setSuccess(true);
          onLogin(data, () => setTimeout(() => window.location.reload(), 0));
        },
      },
    );
  };

  const handleLoginGoogle = () => {
    loginGoogleMutate(null, {
      onSuccess(data) {
        router.push(data.url);
        localStorage.setItem("callbackRoute", router.asPath);
      },
    });
  };

  const handleLoginFacebook = () => {
    loginFacebookMutate(null, {
      onSuccess(data) {
        router.push(data.url);
        localStorage.setItem("callbackRoute", router.asPath);
      },
    });
  };

  return (
    <Box
      display="flex"
      sx={{
        animation: `${fadeIn} ease-in .5s`,
        width: `90vw`,
        maxWidth: "926px",
      }}
    >
      <Box
        position="relative"
        flex={1}
        sx={{ display: { sm: "block", xs: "none" } }}
      >
        <Image
          //@ts-ignore
          src={img}
          layout="fill"
          alt="Login Image"
        />
      </Box>
      <Box
        flex={1}
        sx={{
          borderTop: "4px solid ",
          borderColor: "primary.main",
        }}
      >
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          p={{ sm: 3.75, xs: 1 }}
        >
          <IconButton
            aria-label="close"
            sx={{
              position: "relative",
              right: "-6px",
              top: "-6px",
            }}
            onClick={onClose}
          >
            <CloseIcon width={14} height={14} />
          </IconButton>

          <Box sx={{ width: "100%" }}>
            <Typography align={"center"} variant="h4" textTransform="uppercase">
              <b>{translate.login}</b>
            </Typography>
            <Typography
              textAlign="center"
              variant="body2"
              letterSpacing="0.02em"
              color="grey.500"
            >
              {translate.quickLogin}
            </Typography>
            <Box
              mt={{ sm: 4, xs: 2 }}
              width="100%"
              px={0.75}
              display="flex"
              justifyContent="center"
            >
              <CardMedia
                component="img"
                sx={{
                  height: 44,
                  width: 44,
                  ":hover": { cursor: "pointer" },
                }}
                onClick={handleLoginGoogle}
                image={GoogleLogo.src}
              />
              <CardMedia
                component="img"
                sx={{
                  height: 44,
                  width: 44,
                  ml: "12px",
                  ":hover": { cursor: "pointer" },
                }}
                onClick={handleLoginFacebook}
                image={FacebookLogo.src}
              />
            </Box>
            <Box
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{
                marginTop: "24px",
                "&::before": {
                  content: `""`,
                  display: "inline-block",
                  width: "100%",
                  height: "1px",
                  borderTop: "1px solid ",
                  borderColor: "grey.200",
                },
              }}
            >
              <Typography
                variant="caption"
                letterSpacing="0.02em"
                bgcolor="background.default"
                px={3}
                sx={{
                  display: "inline-block",
                  transform: "translateY(-50%)",
                }}
              >
                {translate.or}
              </Typography>
            </Box>
            <Box px={0.75}>
              <Formik
                initialValues={loginInitialValues}
                validationSchema={loginValidations}
                onSubmit={async (values) => {
                  handleSubmit(values);
                }}
                validateOnBlur={false}
                validateOnMount={false}
                validateOnChange={false}
                enableReinitialize
              >
                {(props) => {
                  const { handleSubmit, handleChange, errors } = props;
                  return (
                    <Form onSubmit={handleSubmit}>
                      <Box height="69px">
                        <TextField
                          id="email"
                          name="email"
                          type="email"
                          label="Email"
                          variant="standard"
                          error={Boolean(errors.email) || error}
                          onChange={handleChange}
                          sx={{ width: "100%" }}
                        />
                        <LcFormHelperText
                          errors={
                            error
                              ? { email: "authentication.loginFail" }
                              : errors
                          }
                          field={["email"]}
                        />
                      </Box>
                      <Box mt={1.5} position="relative" height="69px">
                        <PasswordField
                          id="password"
                          name="password"
                          label={translate.password}
                          error={Boolean(errors.password)}
                          onChange={handleChange}
                          sx={{ height: "48px", width: "100%" }}
                        />
                        <LcFormHelperText
                          errors={errors}
                          field={["password"]}
                        />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ margin: "20px 0 16px 0" }}
                      >
                        <Link
                          href="#"
                          variant="body2"
                          underline="none"
                          onClick={(e) => onGoToForgotPassword(e)}
                        >
                          {translate.forgotPassword}
                        </Link>
                      </Box>

                      {!success ? (
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={isLoading ? true : false}
                        >
                          {isLoading ? (
                            <CircularProgress size={25} color="inherit" />
                          ) : (
                            translate.login
                          )}
                        </Button>
                      ) : (
                        <AuthenticationAlert
                          alertText={translate.loginSuccess}
                          alertType="success"
                        />
                      )}
                    </Form>
                  );
                }}
              </Formik>
              <Box display="flex" justifyContent="center" mt={4}>
                <Typography variant="body2">{translate.haveAccount}</Typography>
                <Link
                  href=""
                  variant="body2"
                  underline="none"
                  pl={0.5}
                  onClick={(e) => onGoToRegister(e)}
                >
                  {translate.registerNow}
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const LcLoginModal = memo(LcLoginModalComponent, isEqual);
