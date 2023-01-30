import { useForgotPassword, useResetPassword } from "@hera/data";
import { AuthenticationAlert, InputField, PasswordField } from "@hera/ui";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  keyframes,
  Typography,
  useTheme,
} from "@mui/material";
import { IAuthenticationModalProps } from "@nestle/types";
import {
  forgotPasswordInitialValues,
  forgotPasswordValidations,
  resetPasswordInitialValues,
  resetPasswordValidations,
} from "@nestle/validations";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
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
interface ForgotpassProps {
  onChangeForm?: (e) => void;
  setEmail?: (e) => void;
  forgotPasswordMutate?: (x, y) => void;
  forgotPasswordLoading?: boolean;
  locale: string;
  translate: any;
}
const ForgotPassword = ({
  onChangeForm,
  setEmail,
  forgotPasswordMutate,
  forgotPasswordLoading,
  locale,
  translate,
}: ForgotpassProps) => {
  const handleSendEmail = async (values) => {
    setEmail(values.email);
    forgotPasswordMutate(
      { ...values },
      {
        onError() {},
        onSuccess() {
          onChangeForm(true);
        },
      },
    );
  };
  return (
    <Box>
      <Formik
        initialValues={forgotPasswordInitialValues}
        validationSchema={forgotPasswordValidations}
        onSubmit={(values) => {
          handleSendEmail(values);
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
              <Box mt={4}>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  sx={{ width: "100%" }}
                />
                <NesFormHelperText errors={errors} field={["email"]} />
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: "32px",
                  height: "42px",
                }}
                disabled={forgotPasswordLoading ? true : false}
              >
                {forgotPasswordLoading ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  translate.sendVerify
                )}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

interface resetPasswordProps {
  email: string;
  onClose?: () => void;
  resetPasswordMutate: (x, y) => void;
  forgotPasswordMutate: (x) => void;
  resetPasswordLoading: boolean;
  locale: string;
  translate: any;
}
const ResetPassword = ({
  email,
  onClose,
  resetPasswordMutate,
  forgotPasswordMutate,
  resetPasswordLoading,
  locale,
  translate,
}: resetPasswordProps) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values) => {
    resetPasswordMutate(
      { ...values, email: email },
      {
        onError() {
          setError(true);
        },
        onSuccess() {
          setSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        },
      },
    );
  };

  const handleResendEmail = () => {
    forgotPasswordMutate({ email: email });
  };

  return (
    <Box mt={4}>
      <Formik
        initialValues={resetPasswordInitialValues}
        validationSchema={resetPasswordValidations}
        onSubmit={(values) => {
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
              <Box width="100%" display="flex" justifyContent="space-between">
                <Box flex="1">
                  <InputField
                    id="token"
                    name="token"
                    type="text"
                    label="OTP"
                    variant="outlined"
                    onChange={handleChange}
                    error={Boolean(errors.token) || error}
                    sx={{ width: "100%" }}
                  />
                  <Box sx={{ pl: "14px" }}>
                    <NesFormHelperText
                      errors={
                        error ? { token: "authentication.OTPWrong" } : errors
                      }
                      field={["token"]}
                    />
                  </Box>
                </Box>
                <Box
                  height="40px"
                  display="flex"
                  alignItems="center"
                  sx={{
                    top: 0,
                    right: "0",
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    disabled={resetPasswordLoading ? true : false}
                    onClick={handleResendEmail}
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {translate.resend}
                  </Button>
                </Box>
              </Box>
              <Box position="relative" mt={2.25}>
                <PasswordField
                  id="password"
                  name="password"
                  label={translate.newPassword}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  sx={{ width: "100%" }}
                  variant="outlined"
                />
                <Box sx={{ pl: "14px" }}>
                  <NesFormHelperText errors={errors} field={["password"]} />
                </Box>
              </Box>
              <Box position="relative" mt={2.25}>
                <PasswordField
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  label={translate.newConfirmPassword}
                  onChange={handleChange}
                  error={Boolean(errors.passwordConfirmation)}
                  sx={{ width: "100%" }}
                  variant="outlined"
                />
                <Box sx={{ pl: "14px" }}>
                  <NesFormHelperText
                    errors={errors}
                    field={["passwordConfirmation"]}
                  />
                </Box>
              </Box>
              <Box mt="42px">
                {!success ? (
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      height: "42px",
                    }}
                    disabled={resetPasswordLoading ? true : false}
                  >
                    {resetPasswordLoading ? (
                      <CircularProgress size={25} color="inherit" />
                    ) : (
                      translate.passwordRetrieval
                    )}
                  </Button>
                ) : (
                  <AuthenticationAlert
                    alertText={translate.changePasswordSucess}
                    alertType="success"
                  />
                )}
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
const NesForgotPassModalComponent = ({
  onClose,
  onBackToLogin,
  img,
}: Props) => {
  const { formatMessage, locale } = useIntl();
  const [changeForm, setChangeForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const theme = useTheme();
  const translate = {
    forgotPassword: formatMessage({ id: "authentication.forgotPassword" }),
    quickLogin: formatMessage({ id: "authentication.quickLogin" }),
    or: formatMessage({ id: "authentication.or" }),
    password: formatMessage({ id: "authentication.password" }),
    confirmPassword: formatMessage({ id: "authentication.confirmPassword" }),
    returnLogin: formatMessage({ id: "authentication.returnLogin" }),
    sendVerify: formatMessage({ id: "authentication.sendVerify" }),
    resendEmailLabel: formatMessage({ id: "authentication.resendEmailLabel" }),
    resend: formatMessage({ id: "authentication.resend" }),
    OTPWrong: formatMessage({ id: "authentication.OTPWrong" }),
    newPassword: formatMessage({ id: "authentication.newPassword" }),
    newConfirmPassword: formatMessage({
      id: "authentication.newConfirmPassword",
    }),

    passwordRetrieval: formatMessage({
      id: "authentication.passwordRetrieval",
    }),
    changePasswordSucess: formatMessage({
      id: "authentication.changePasswordSucess",
    }),
  };

  const { mutate: forgotPasswordMutate, isLoading: forgotPasswordLoading } =
    useForgotPassword();
  const { mutate: resetPasswordMutate, isLoading: resetPasswordLoading } =
    useResetPassword();

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
        onClick={onClose}
        sx={{
          position: "absolute",
          right: "9px",
          top: "9px",
        }}
      >
        <CloseIcon width={14} height={14} />
      </IconButton>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          p={{ sm: 4, xs: 2 }}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Typography
                textAlign={"center"}
                variant="h4"
                color={theme.palette.text.primary}
              >
                <b>{translate.forgotPassword}</b>
              </Typography>
              <Typography
                textAlign="center"
                variant="body2"
                letterSpacing="0.02em"
                color={theme.palette.text.secondary}
              >
                {translate.resendEmailLabel}
              </Typography>
              {changeForm ? (
                <ResetPassword
                  email={email}
                  onClose={onClose}
                  resetPasswordMutate={resetPasswordMutate}
                  forgotPasswordMutate={forgotPasswordMutate}
                  resetPasswordLoading={resetPasswordLoading}
                  locale={locale}
                  translate={translate}
                />
              ) : (
                <ForgotPassword
                  forgotPasswordMutate={forgotPasswordMutate}
                  forgotPasswordLoading={forgotPasswordLoading}
                  onChangeForm={setChangeForm}
                  setEmail={setEmail}
                  locale={locale}
                  translate={translate}
                />
              )}
            </Box>
          </Box>
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="text"
              color="inherit"
              sx={{ mt: "32px", color: theme.palette.text.primary }}
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

export const NesForgotPassModal = memo(NesForgotPassModalComponent, isEqual);
