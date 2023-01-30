import { AuthenticationContext } from "@hera/contexts";
import {
  useAuthenticatedCart,
  useLoginFacebook,
  useLoginGoogle,
  useLoginPasswordMutation,
} from "@hera/data";
import { AuthenticationAlert, InputField, PasswordField } from "@hera/ui";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  IconButton,
  keyframes,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import { FacebookLogo, GoogleLogo } from "@nestle/static/images";
import { loginInitialValues, loginValidations } from "@nestle/validations";
import { Form, Formik } from "formik";

import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { IAuthenticationModalProps } from "../types";
import { NesFormHelperText } from "./NesFormHelperText";

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

const NesLoginModalComponent = ({
  onClose,
  onGoToRegister,
  onGoToForgotPassword,
  img,
}: Props) => {
  const theme = useTheme();
  const { formatMessage, locale } = useIntl();
  const { mutate, isLoading } = useLoginPasswordMutation();
  const { onLogin } = useContext(AuthenticationContext);

  const { mutate: loginGoogleMutate } = useLoginGoogle();
  const [success, setSuccess] = useState(false);
  const { mutate: loginFacebookMutate } = useLoginFacebook();
  const { refetch: refetchShoppingCart } = useAuthenticatedCart();
  const [error, setError] = useState(false);
  const router = useRouter();
  const handleSubmit = async (values) => {
    mutate(
      { ...values },
      {
        onError() {
          setError(true);
        },
        async onSuccess(data) {
          setSuccess(true);
          onLogin(data, () => setTimeout(() => window.location.reload(), 1500));
        },
      },
    );
  };
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
      position="relative"
      sx={{
        animation: `${fadeIn} ease-in .5s`,
        width: { sm: "500px", xs: "347px" },
      }}
    >
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: "9px",
          top: "9px",
        }}
        onClick={onClose}
      >
        <CloseIcon width={14} height={14} />
      </IconButton>
      <Box flex={1}>
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          p={{ sm: 4, xs: 2 }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              align={"center"}
              variant="h4"
              color={theme.palette.text.primary}
            >
              <b>{translate.login}</b>
            </Typography>
            <Typography
              textAlign="center"
              variant="body2"
              letterSpacing="0.02em"
              color={theme.palette.text.secondary}
            >
              {translate.quickLogin}
            </Typography>
            <Box
              mt={{ sm: 4, xs: 2 }}
              width="100%"
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
              display="flex"
              justifyContent="center"
              alignItems="center"
              my={1.5}
            >
              <Typography
                variant="body2"
                letterSpacing="0.02em"
                px={1.5}
                color={theme.palette.text.primary}
              >
                {translate.or}
              </Typography>
            </Box>
            <Box>
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
                      <Box>
                        <InputField
                          id="email"
                          name="email"
                          type="email"
                          label="Email"
                          error={Boolean(errors.email) || error}
                          onChange={handleChange}
                          fullWidth
                          sx={{
                            input: {
                              color: theme.palette.common.black,
                            },
                          }}
                          variant="outlined"
                        />
                        <Box sx={{ pl: "14px" }}>
                          <NesFormHelperText
                            errors={
                              error
                                ? { email: "authentication.loginFail" }
                                : errors
                            }
                            field={["email"]}
                          />
                        </Box>
                      </Box>
                      <Box mt={2.25} position="relative">
                        <PasswordField
                          id="password"
                          name="password"
                          label={translate.password}
                          error={Boolean(errors.password)}
                          onChange={handleChange}
                          fullWidth
                          sx={{
                            input: {
                              color: theme.palette.common.black,
                            },
                          }}
                          variant="outlined"
                        />
                        <Box sx={{ pl: "14px" }}>
                          <NesFormHelperText
                            errors={errors}
                            field={["password"]}
                          />
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ margin: "16px 0" }}
                      >
                        <Link
                          href="#"
                          variant="body2"
                          underline="none"
                          color={theme.palette.text.secondary}
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
                          sx={{ height: "42px" }}
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
                <Typography variant="body2" color={theme.palette.common.black}>
                  {translate.haveAccount}
                </Typography>
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

export const NesLoginModal = memo(NesLoginModalComponent, isEqual);
