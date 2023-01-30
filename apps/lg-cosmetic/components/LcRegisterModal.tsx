import { Image, PasswordField } from "@hera/ui";
import { FacebookLogo, GoogleLogo } from "@lc/static/images";
import { registerInitialValues, registerValidations } from "@lc/validations";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { memo, useContext, useState } from "react";
import { IAuthenticationModalProps } from "../types";

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
import isEqual from "react-fast-compare";

import { AuthenticationContext } from "@hera/contexts";
import {
  useLoginFacebook,
  useLoginGoogle,
  useRegisterPasswordMutation,
} from "@hera/data";
import { AuthenticationAlert } from "@hera/ui";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { LcFormHelperText } from "./LcFormHelperText";

interface Props extends IAuthenticationModalProps {
  onBackToLogin?: () => void;
}

const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to { opacity: 1;}
`;

const LcRegisterModalComponent = ({ onClose, onBackToLogin, img }: Props) => {
  const { formatMessage, locale } = useIntl();

  const { mutate: loginGoogleMutate } = useLoginGoogle();
  const { mutate: loginFacebookMutate } = useLoginFacebook();
  const { mutate, isLoading } = useRegisterPasswordMutation();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { onLogin } = useContext(AuthenticationContext);

  const handleSubmit = async (values) => {
    mutate(
      { ...values },
      {
        onError() {
          setError(true);
        },
        onSuccess(data) {
          setSuccess(true);
          onLogin(data, () => setTimeout(() => window.location.reload(), 0));
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
          alt="Register Image"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex={1}
        sx={{
          borderTop: "4px solid ",
          borderColor: "primary.main",
        }}
      >
        <Box
          p={{ sm: 3.75, xs: 1 }}
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "relative",
              right: "-6px",
              top: "-6px",
            }}
          >
            <CloseIcon width={14} height={14} />
          </IconButton>
          <Box sx={{ width: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography
                align={"center"}
                variant="h4"
                textTransform="uppercase"
              >
                <b>{translate.register}</b>
              </Typography>
              <Typography textAlign="center" variant="body2" color="grey.500">
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
                mt={3}
                sx={{
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
                        <Box height="69px">
                          <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            variant="standard"
                            onChange={handleChange}
                            error={Boolean(errors.email) || error}
                            sx={{ width: "100%" }}
                          />
                          <LcFormHelperText
                            errors={
                              error
                                ? { email: "authentication.registerFail" }
                                : errors
                            }
                            field={["email"]}
                          />
                        </Box>
                        <Box height="69px">
                          <TextField
                            id="phone"
                            name="phone"
                            type="tel"
                            label={translate.phone}
                            variant="standard"
                            onChange={handleChange}
                            error={Boolean(errors.phone)}
                            sx={{
                              width: "100%",
                              input: {
                                MozAppearance: "StyledTextField",
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                  },
                              },
                            }}
                          />
                          <LcFormHelperText errors={errors} field={["phone"]} />
                        </Box>
                        <Box position="relative" height="69px">
                          <PasswordField
                            id="password"
                            name="password"
                            label={translate.password}
                            onChange={handleChange}
                            error={Boolean(errors.password)}
                            sx={{ width: "100%" }}
                          />
                          <LcFormHelperText
                            errors={errors}
                            field={["password"]}
                          />
                        </Box>
                        <Box position="relative" height="69px">
                          <PasswordField
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            label={translate.confirmPassword}
                            onChange={handleChange}
                            error={Boolean(errors.passwordConfirmation)}
                            sx={{ width: "100%" }}
                          />
                          <LcFormHelperText
                            errors={errors}
                            field={["passwordConfirmation"]}
                          />
                        </Box>

                        <Typography my={2} variant="body2" textAlign="center">
                          {translate.privacy}
                        </Typography>

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

export const LcRegisterModal = memo(LcRegisterModalComponent, isEqual);
