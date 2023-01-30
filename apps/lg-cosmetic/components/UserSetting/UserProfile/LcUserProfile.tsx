import { AuthenticationContext } from "@hera/contexts";
import React, { useContext, useEffect, useState } from "react";

import { IUserInfo, useCurrentUser, useUpdateProfile } from "@hera/data";
import { convertPhoneNumber } from "@hera/utils";
import { LcConfirmationDialog } from "@lc/components";
import {
  updateUserProfileInitialValues,
  updateUserProfileValidations,
} from "@lc/validations";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { get, isNil } from "lodash-es";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { LcUserChangePasswordModal } from "../modals/LcUserChangePasswordModal";

export interface IUpdateUserProfile
  extends Omit<
    IUserInfo,
    "id" | "isActive" | "isVerified" | "avatar" | "passwordBlank"
  > {}

const StyledTextField = styled(TextField)`
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.palette.text.primary};
    ${({ theme }) => theme.typography.overline};
    text-transform: none;
  }
`;

const SettingMenuPaper = styled(Paper)`
  border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  padding: 32px;
`;

export const LcUserProfile: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const { isLogin } = useContext(AuthenticationContext);

  const {
    data: userInfo,
    isSuccess: getUserInfoSuccess,
    refetch,
  } = useCurrentUser(isLogin);

  const { mutateAsync: updateProfileAsync, isLoading } = useUpdateProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDob, setOpenDob] = useState(false);
  const [userProfile, setUserProfile] = useState<IUpdateUserProfile>(
    updateUserProfileInitialValues,
  );

  useEffect(() => {
    if (getUserInfoSuccess) {
      setUserProfile({
        lastName: get(userInfo, "user.lastName"),
        firstName: get(userInfo, "user.firstName"),
        phone: get(userInfo, "user.phone"),
        email: get(userInfo, "user.email"),
        dob: get(userInfo, "user.dob"),
        gender: get(userInfo, "user.gender"),
      });
    }
  }, [getUserInfoSuccess]);

  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false);

  const handleUpdateProfile = async (values: IUserInfo, actions) => {
    setIsSubmitting(true);
    try {
      values.phone = convertPhoneNumber(values?.phone);
      if (
        dayjs(values.dob).isSameOrAfter(dayjs(), "day") ||
        !dayjs(values.dob).isValid() ||
        values.dob === "Invalid Date"
      ) {
        throw new SyntaxError(`{"dob": "userSetting.invalidDob"}`);
      }
      await updateProfileAsync(values);
      refetch();
      enqueueSnackbar(formatMessage({ id: "userSetting.updateSuccess" }), {
        variant: "success",
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        const CSRError = JSON.parse(error?.message || "null");
        if (
          !isNil(CSRError) &&
          typeof CSRError === "object" &&
          Object.keys(CSRError).length > 0
        ) {
          const [[key, value]] = Object.entries(CSRError);
          actions.setFieldError(key, value as string);
        }
      } else {
        enqueueSnackbar(formatMessage({ id: "userSetting.updateFail" }), {
          variant: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const genders = [
    { name: `${formatMessage({ id: "userSetting.male" })}`, value: "male" },
    { name: `${formatMessage({ id: "userSetting.female" })}`, value: "female" },
    { name: `${formatMessage({ id: "userSetting.other" })}`, value: "other" },
  ];

  return (
    <SettingMenuPaper elevation={3} sx={{ p: { xs: 2 } }}>
      <Box sx={{ maxWidth: "100%" }}>
        <Typography
          variant="h5"
          color="primary"
          textTransform="uppercase"
          sx={{ mb: 3 }}
        >
          {formatMessage({ id: "userSetting.userInfo" })}
        </Typography>
        <Formik
          initialValues={userProfile}
          validationSchema={updateUserProfileValidations}
          onSubmit={handleUpdateProfile}
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize
        >
          {(props) => {
            const {
              values,
              setFieldValue,
              handleSubmit,
              errors,
              touched,
              setFieldError,
            } = props;
            return (
              <Form onSubmit={handleSubmit}>
                <Grid spacing={2} container sx={{ mb: 6 }}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      id="lastName"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      name="lastName"
                      label={formatMessage({ id: "userSetting.lastName" })}
                      fullWidth
                      value={values.lastName}
                      onChange={(e) => {
                        setFieldValue("lastName", e.target.value);
                      }}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      id="firstName"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      name="firstName"
                      label={formatMessage({ id: "userSetting.firstName" })}
                      fullWidth
                      value={values.firstName}
                      onChange={(e) => {
                        setFieldValue("firstName", e.target.value);
                      }}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        input: {
                          MozAppearance: "StyledTextField",
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      name="phone"
                      id="phone"
                      type="number"
                      fullWidth
                      label={formatMessage({ id: "userSetting.phone" })}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      value={values.phone}
                      onChange={(e) => {
                        setFieldValue("phone", e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      id="email"
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      name="email"
                      label={formatMessage({ id: "userSetting.email" })}
                      fullWidth
                      value={values.email}
                      disabled
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      select
                      label={formatMessage({ id: "userSetting.genders" })}
                      id="gender"
                      variant="standard"
                      fullWidth
                      value={values.gender}
                      onChange={(e) => {
                        setFieldValue("gender", e.target.value);
                      }}
                    >
                      {genders.map((gender) => (
                        <MenuItem key={gender.value} value={gender.value}>
                          {`${gender.name}`}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      maxDate={new Date()}
                      onOpen={() => setOpenDob(true)}
                      onClose={() => setOpenDob(false)}
                      open={openDob}
                      value={dayjs.utc(values.dob).format()}
                      onChange={(value) => {
                        if (
                          dayjs(value).isSameOrAfter(dayjs(), "day") ||
                          value === null
                        ) {
                          setFieldError(
                            "dob",
                            formatMessage({ id: "userSetting.invalidDob" }),
                          );
                        }

                        setFieldValue("dob", dayjs.utc(value).format());
                      }}
                      renderInput={(params) => (
                        <StyledTextField
                          {...params}
                          id="dob"
                          InputLabelProps={{ shrink: true }}
                          name="dob"
                          fullWidth
                          onChange={(e) => {
                            if (
                              dayjs
                                .utc(e.target.value, "DD/MM/YYYY")
                                .isSameOrAfter(dayjs(), "day")
                            ) {
                              setFieldError(
                                "dob",
                                formatMessage({ id: "userSetting.invalidDob" }),
                              );
                            } else {
                              setFieldError("dob", null);
                              setFieldValue(
                                "dob",
                                dayjs.utc(e.target.value).format(),
                              );
                            }
                          }}
                          label={formatMessage({ id: "userSetting.birthday" })}
                          variant="standard"
                          onClick={() => setOpenDob(true)}
                          error={touched.dob && Boolean(errors.dob)}
                          helperText={touched.dob && errors.dob}
                        />
                      )}
                      inputFormat="dd/MM/yyyy"
                    />
                  </Grid>
                </Grid>
                {/* Will use later when login with Google and Facebook finished */}
                {/* <LcUserSocialConnect /> */}
                <Stack spacing={2} direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setChangePasswordModalOpen(true);
                    }}
                  >
                    {formatMessage({ id: "userSetting.changePassword" })}
                  </Button>
                  <Button variant="contained" size="small" type="submit">
                    {isSubmitting ? (
                      <CircularProgress
                        sx={{ color: "common.white" }}
                        size="20px"
                      />
                    ) : (
                      formatMessage({ id: "userSetting.update" })
                    )}
                  </Button>
                </Stack>
                <LcUserChangePasswordModal
                  open={changePasswordModalOpen}
                  onClose={() => {
                    setChangePasswordModalOpen(false);
                  }}
                />
              </Form>
            );
          }}
        </Formik>
        <LcConfirmationDialog
          title={formatMessage({ id: "userSetting.personalProfile" })}
          description={formatMessage({
            id: "userSetting.updateProfileSuccess",
          })}
          open={openDialog}
          onConfirmClick={() => {
            setOpenDialog(false);
          }}
          onClose={() => setOpenDialog(false)}
          onlyConfirmation
        />
      </Box>
    </SettingMenuPaper>
  );
};
