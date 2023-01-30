import { AuthenticationContext } from "@hera/contexts";
import { useChangePasswordMutation } from "@hera/data";
import { PasswordField } from "@hera/ui";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
  useTheme,
} from "@mui/material";

import { AuthenticationAlert } from "@hera/ui";
import { useBreakPoint } from "@nestle/hooks";
import {
  changePasswordInitialValues,
  changePasswordValidations,
} from "@nestle/validations";
import { Form, Formik, FormikHelpers } from "formik";
import { FC, useContext, useState } from "react";
import { useIntl } from "react-intl";

interface IUserChangePasswordModalProps {
  open: boolean;
  closeModal: () => void;
}

const ChangePassword = styled(Dialog)`
  .MuiDialogTitle-root {
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
    padding: 16px 16px 12px 16px;
  }

  .MuiDialogContent-root {
    padding-top: 12px !important;
    padding: 12px 16px 16px 16px;
  }
`;

const FormBox = styled(Box)`
  .MuiFormLabel-asterisk {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

export const NesUserChangePasswordModal: FC<IUserChangePasswordModalProps> = ({
  open,
  closeModal,
}) => {
  const { mutate: changePassword, isLoading: changePasswordLoading } =
    useChangePasswordMutation();
  const isPC = useBreakPoint("sm");
  const theme = useTheme();
  const { onLogout } = useContext(AuthenticationContext);
  const [isSuccess, setSuccess] = useState(false);

  const { formatMessage } = useIntl();

  const translateErrorMessage = (message: string) => {
    switch (message) {
      case "password not matched":
        return formatMessage({ id: "userSetting.passwordIncorrect" });

      default:
        return formatMessage({ id: "userSetting.passwordInvalid" });
    }
  };

  const handleSubmit = async (values, actions: FormikHelpers<any>) => {
    changePassword(
      { ...values },
      {
        onSuccess() {
          setSuccess(true);
          setTimeout(onLogout, 2000);
        },
        onError(error) {
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
    update: formatMessage({ id: "userSetting.update" }),
    closeModal: formatMessage({ id: "userSetting.closeModal" }),
    currentPassword: formatMessage({ id: "userSetting.currentPassword" }),
    newPassword: formatMessage({ id: "userSetting.newPassword" }),
    confirmPassword: formatMessage({ id: "userSetting.confirmPassword" }),
    changePasswordSucess: formatMessage({
      id: "authentication.changePasswordSucess",
    }),
  };

  return (
    <ChangePassword
      open={open}
      onClose={closeModal}
      sx={{
        ".MuiDialog-paper": {
          minWidth: isPC ? "480px" : "100%",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">{pageContent.changePassword}</Typography>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={changePasswordInitialValues}
          validationSchema={changePasswordValidations}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ values, handleSubmit, handleChange, touched, errors }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <FormBox>
                  <Box display="flex" position="relative">
                    <PasswordField
                      InputLabelProps={{
                        sx: {
                          fontSize: theme.typography.body1.fontSize,
                        },
                      }}
                      InputProps={{
                        sx: {
                          fontSize: theme.typography.body1.fontSize,
                        },
                      }}
                      size="small"
                      required
                      variant="outlined"
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
                      sx={{ width: "100%", mb: 2 }}
                      value={values.currentPassword}
                    />
                  </Box>
                  <Box display="flex" position="relative">
                    <PasswordField
                      InputLabelProps={{
                        sx: {
                          fontSize: theme.typography.body1.fontSize,
                        },
                      }}
                      InputProps={{
                        sx: {
                          fontSize: theme.typography.body1.fontSize,
                        },
                      }}
                      size="small"
                      required
                      variant="outlined"
                      id="password"
                      name="password"
                      label={pageContent.newPassword}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ width: "100%", mb: 2 }}
                      value={values.password}
                    />
                  </Box>
                  <Box display="flex" position="relative">
                    <PasswordField
                      InputLabelProps={{
                        sx: {
                          fontSize: theme.typography.body1.fontSize,
                        },
                      }}
                      InputProps={{
                        sx: {
                          fontSize: theme.typography.body1.fontSize,
                        },
                      }}
                      size="small"
                      required
                      variant="outlined"
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
                      sx={{ width: "100%", mb: 2 }}
                      value={values.passwordConfirmation}
                    />
                  </Box>
                  {isSuccess ? (
                    <AuthenticationAlert
                      alertText={pageContent.changePasswordSucess}
                      alertType="success"
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1.5,
                      }}
                    >
                      <Button
                        color="inherit"
                        variant="outlined"
                        onClick={() => closeModal()}
                        size="large"
                        fullWidth
                      >
                        {pageContent.closeModal}
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        sx={{ ml: 1 }}
                        fullWidth
                        disabled={changePasswordLoading}
                      >
                        {changePasswordLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          pageContent.update
                        )}
                      </Button>
                    </Box>
                  )}
                </FormBox>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </ChangePassword>
  );
};
