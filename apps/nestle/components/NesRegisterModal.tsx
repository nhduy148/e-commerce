import { AuthenticationContext } from "@hera/contexts";
import {
  useLoginFacebook,
  useLoginGoogle,
  useRegisterPasswordMutation,
} from "@hera/data";
import { AuthenticationAlert, InputField, PasswordField } from "@hera/ui";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
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
import {
  registerInitialValues,
  registerValidations,
} from "@nestle/validations";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { IAuthenticationModalProps } from "../types";
import { NesFormHelperText } from "./NesFormHelperText";

interface Props extends IAuthenticationModalProps {
  onBackToLogin?: () => void;
}

const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to { opacity: 1;}
`;

const NesRegisterModalComponent = ({ onClose, onBackToLogin, img }: Props) => {
  const { formatMessage, locale } = useIntl();
  const theme = useTheme();
  const { onLogin } = useContext(AuthenticationContext);
  const { mutate: loginGoogleMutate } = useLoginGoogle();
  const { mutate: loginFacebookMutate } = useLoginFacebook();
  const { mutate, isLoading } = useRegisterPasswordMutation();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values) => {
    mutate(
      { ...values },
      {
        onError() {
          setError(true);
        },
        onSuccess(data) {
          setSuccess(true);
          onLogin(data, () => setTimeout(() => window.location.reload(), 1500));
        },
      },
    );
  };
  const translate = {
    register: formatMessage({ id: "authentication.register" }),
    quickLogin: formatMessage({ id: "authentication.quickLogin" }),
    or: formatMessage({ id: "authentication.or" }),
    password: formatMessage({ id: "authentication.password" }),
    registerFail: formatMessage({ id: "authentication.registerFail" }),
    confirmPassword: formatMessage({ id: "authentication.confirmPassword" }),
    returnLogin: formatMessage({ id: "authentication.returnLogin" }),
    privacy: formatMessage(
      { id: "privacy.privacyContent" },
      {
        link1: (
          <>
            {" "}
            <Link
              color={theme.palette.secondary.light}
              href="#"
              underline="hover"
              onClick={(e) => {
                e.preventDefault();
                router.push("/terms");
              }}
              fontSize="inherit"
            >
              {formatMessage({ id: "privacy.terms" })}
            </Link>
          </>
        ),
        link2: (
          <>
            {" "}
            <Link
              color={theme.palette.secondary.light}
              href="#"
              underline="hover"
              onClick={(e) => {
                e.preventDefault();
                router.push("/security-policy");
              }}
              fontSize="inherit"
            >
              {formatMessage({ id: "privacy.policy" })}
            </Link>
          </>
        ),
      },
    ),
    phone: formatMessage({ id: "authentication.phone" }),
    registerSuccess: formatMessage({ id: "authentication.registerSuccess" }),
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex={1}
      >
        <Box
          p={{ sm: 4, xs: 2 }}
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
        >
          <Box sx={{ width: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography
                align={"center"}
                variant="h4"
                color={theme.palette.text.primary}
              >
                <b>{translate.register}</b>
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
                  initialValues={registerInitialValues}
                  validationSchema={registerValidations}
                  onSubmit={async (values) => {
                    handleSubmit(values);
                  }}
                  validateOnBlur={false}
                  validateOnMount={false}
                  validateOnChange={false}
                  enableReinitialize
                >
                  {(props) => {
                    const { handleChange, errors } = props;
                    return (
                      <Form>
                        <Box>
                          <InputField
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            variant="outlined"
                            onChange={handleChange}
                            error={Boolean(errors.email) || error}
                            fullWidth
                            sx={{
                              input: {
                                color: theme.palette.common.black,
                              },
                            }}
                          />
                          <Box sx={{ pl: "14px" }}>
                            <NesFormHelperText
                              errors={
                                error
                                  ? { email: "authentication.registerFail" }
                                  : errors
                              }
                              field={["email"]}
                            />
                          </Box>
                        </Box>
                        <Box mt={2.25}>
                          <InputField
                            id="phone"
                            name="phone"
                            type="tel"
                            label={translate.phone}
                            variant="outlined"
                            onChange={handleChange}
                            error={Boolean(errors.phone)}
                            fullWidth
                            sx={{
                              input: {
                                color: theme.palette.common.black,
                                MozAppearance: "StyledTextField",
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                              },
                            }}
                          />
                          <Box sx={{ pl: "14px" }}>
                            <NesFormHelperText
                              errors={errors}
                              field={["phone"]}
                            />
                          </Box>
                        </Box>
                        <Box position="relative" mt={2.25}>
                          <PasswordField
                            id="password"
                            name="password"
                            label={translate.password}
                            onChange={handleChange}
                            error={Boolean(errors.password)}
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
                        <Box position="relative" mt={2.25}>
                          <PasswordField
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            label={translate.confirmPassword}
                            onChange={handleChange}
                            error={Boolean(errors.passwordConfirmation)}
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
                              field={["passwordConfirmation"]}
                            />
                          </Box>
                        </Box>
                        <Typography
                          my={2}
                          variant="body2"
                          color={theme.palette.text.secondary}
                          textAlign="center"
                        >
                          {translate.privacy}
                        </Typography>

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
                              translate.register
                            )}
                          </Button>
                        ) : (
                          <AuthenticationAlert
                            alertText={translate.registerSuccess}
                            alertType="success"
                          />
                        )}
                      </Form>
                    );
                  }}
                </Formik>
              </Box>
            </Box>
          </Box>
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={{ sm: 4, xs: 1 }}
          >
            <Button
              variant="text"
              color="inherit"
              sx={{
                color: theme.palette.text.secondary,
              }}
              startIcon={<ArrowBackIcon />}
              onClick={onBackToLogin}
            >
              {translate.returnLogin}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const NesRegisterModal = memo(NesRegisterModalComponent, isEqual);
