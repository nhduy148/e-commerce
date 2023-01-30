import { useForgotPassword, useResetPassword } from "@hera/data";
import { AuthenticationAlert, Image, PasswordField } from "@hera/ui";
import { IAuthenticationModalProps } from "@lc/types";
import {
  forgotPasswordInitialValues,
  forgotPasswordValidations,
  resetPasswordInitialValues,
  resetPasswordValidations,
} from "@lc/validations";
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
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";
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
    <Box mt={12.5} px={0.75}>
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
              <Box height="69px">
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="standard"
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  sx={{ width: "100%" }}
                />
                <LcFormHelperText errors={errors} field={["email"]} />
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: "42px",
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
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const [success, setSuccess] = useState(false);

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
    <Box mt={3.25} px={0.75}>
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
              <Box position="relative" height="69px" width="100%">
                <TextField
                  id="token"
                  name="token"
                  type="text"
                  label="OTP"
                  variant="standard"
                  onChange={handleChange}
                  error={Boolean(errors.token) || error}
                  sx={{ width: "100%" }}
                />
                <LcFormHelperText
                  errors={error ? { token: "authentication.OTPWrong" } : errors}
                  field={["token"]}
                />
                <Button
                  variant="text"
                  size="small"
                  disabled={resetPasswordLoading ? true : false}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "0",
                    transform: "translateY(-50%)",
                    textTransform: "capitalize",
                  }}
                  onClick={handleResendEmail}
                >
                  {translate.resend}
                </Button>
              </Box>
              <Box position="relative" height="69px">
                <PasswordField
                  id="password"
                  name="password"
                  label={translate.newPassword}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  sx={{ width: "100%" }}
                />
                <LcFormHelperText errors={errors} field={["password"]} />
              </Box>

              <Box position="relative" height="69px">
                <PasswordField
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  label={translate.newConfirmPassword}
                  onChange={handleChange}
                  error={Boolean(errors.passwordConfirmation)}
                  sx={{ width: "100%" }}
                />
                <LcFormHelperText
                  errors={errors}
                  field={["passwordConfirmation"]}
                />
              </Box>

              {!success ? (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: "42px",
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
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
const LcForgotPassModalComponent = ({ onClose, onBackToLogin, img }: Props) => {
  const { formatMessage, locale } = useIntl();
  const [changeForm, setChangeForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

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
          alt="Forgot Password Image"
        />
      </Box>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
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
                textAlign={"center"}
                variant="h4"
                textTransform="uppercase"
              >
                <b>{translate.forgotPassword}</b>
              </Typography>
              <Typography textAlign="center" variant="body2">
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
              sx={changeForm ? { mt: "26px" } : { mt: "98px" }}
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

export const LcForgotPassModal = memo(LcForgotPassModalComponent, isEqual);
