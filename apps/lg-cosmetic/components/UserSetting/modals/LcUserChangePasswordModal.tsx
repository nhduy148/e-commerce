import { AuthenticationContext } from "@hera/contexts";
import { useChangePasswordMutation } from "@hera/data";
import { useTimer } from "@hera/hooks";
import { PasswordField } from "@hera/ui";
import { LcAlert } from "@lc/components";
import {
  changePasswordInitialValues,
  changePasswordValidations,
} from "@lc/validations";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { FC, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const ChangePassword = styled(Dialog)`
  .MuiDialogTitle-root {
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
    padding: 1.5rem;
  }

  .MuiDialog-paper {
    border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
    width: 100%;
  }

  .MuiDialogContent-root {
    padding-top: 1.5rem !important;
    padding: 1.5rem;
  }

  .MuiDialogActions-root {
    padding: 0 1.5rem 1.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
  }
`;

const FormBox = styled(Box)`
  .MuiFormLabel-asterisk {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

export const LcUserChangePasswordModal: FC<IProps> = ({ open, onClose }) => {
  const { mutate: changePassword, isLoading: changePasswordLoading } =
    useChangePasswordMutation();

  const { formatMessage } = useIntl();
  const { onLogout } = useContext(AuthenticationContext);
  const { timer, startTimer, stopTimer } = useTimer(5, 0);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const translate = {
    passwordIncorrect: formatMessage({ id: "userSetting.passwordIncorrect" }),
    passwordInvalid: formatMessage({ id: "userSetting.passwordInvalid" }),
    alertTitle: formatMessage({ id: "userSetting.changePasswordAlert.title" }),
    alertDescription: formatMessage(
      {
        id: "userSetting.changePasswordAlert.description",
      },
      { br: <br />, timer: timer },
    ),
  };

  useEffect(() => {
    if (timer <= 0) {
      handleCloseModal();
    }
  }, [timer]);

  const translateErrorMessage = (message: string) => {
    switch (message) {
      case "password not matched":
        return translate.passwordIncorrect;

      default:
        return translate.passwordInvalid;
    }
  };

  const handleOpenLogoutModal = () => {
    onLogout(() => {
      setOpenAlert(true);
    }, true);
    startTimer();
  };

  const handleCloseModal = () => {
    stopTimer();
    document.body.style.pointerEvents = "none";
    setOpenAlert(false);
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleSubmit = async (values, actions: FormikHelpers<any>) => {
    changePassword(
      { ...values },
      {
        onSuccess: handleOpenLogoutModal,
        onError(error, variables, context) {
          actions.setFieldError(
            "currentPassword",
            translateErrorMessage(error.message),
          );
        },
      },
    );
  };

  const pageContent = {
    changePassword: formatMessage({ id: "userSetting.changePassword" }),
    change: formatMessage({ id: "userSetting.change" }),
    closeModal: formatMessage({ id: "userSetting.closeModal" }),
    currentPassword: formatMessage({ id: "userSetting.currentPassword" }),
    newPassword: formatMessage({ id: "userSetting.newPassword" }),
    confirmPassword: formatMessage({ id: "userSetting.confirmPassword" }),
  };

  return (
    <>
      <ChangePassword open={open} onClose={onClose}>
        <DialogTitle>
          <Typography variant="h6" textTransform="uppercase">
            {pageContent.changePassword}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={changePasswordInitialValues}
            validationSchema={changePasswordValidations}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({
              values,
              handleSubmit,
              handleChange,
              handleBlur,
              touched,
              errors,
              setFieldError,
            }) => {
              return (
                <Form onSubmit={handleSubmit} style={{ maxWidth: "544px" }}>
                  <FormBox>
                    <Box mt={1.5} display="flex" position="relative">
                      <PasswordField
                        required
                        id="currentPassword"
                        name="currentPassword"
                        label={pageContent.currentPassword}
                        onChange={handleChange}
                        error={
                          touched.currentPassword &&
                          Boolean(errors.currentPassword)
                        }
                        helperText={
                          touched.currentPassword && errors.currentPassword
                        }
                        sx={{ height: "69px", width: "100%" }}
                        value={values.currentPassword}
                      />
                    </Box>
                    <Box mt={1.5} display="flex" position="relative">
                      <PasswordField
                        id="password"
                        name="password"
                        label={pageContent.newPassword}
                        onChange={handleChange}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ height: "69px", width: "100%" }}
                        value={values.password}
                      />
                    </Box>
                    <Box mt={1.5} display="flex" position="relative">
                      <PasswordField
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        label={pageContent.confirmPassword}
                        onChange={handleChange}
                        error={
                          touched.passwordConfirmation &&
                          Boolean(errors.passwordConfirmation)
                        }
                        helperText={
                          touched.passwordConfirmation &&
                          errors.passwordConfirmation
                        }
                        sx={{ height: "69px", width: "100%" }}
                        value={values.passwordConfirmation}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                      }}
                    >
                      <Button
                        color="inherit"
                        variant="contained"
                        onClick={() => onClose()}
                        size="small"
                      >
                        {pageContent.closeModal}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        sx={{ ml: 1 }}
                        disabled={changePasswordLoading}
                      >
                        {changePasswordLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          pageContent.change
                        )}
                      </Button>
                    </Box>
                  </FormBox>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      </ChangePassword>
      <LcAlert
        open={openAlert}
        title={translate.alertTitle}
        onClose={handleCloseModal}
      >
        <Box p={2}>
          <Typography>{translate.alertDescription}</Typography>
        </Box>
      </LcAlert>
    </>
  );
};
