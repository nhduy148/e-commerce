import { AuthenticationContext } from "@hera/contexts";
import { IUserInfo, useCurrentUser, useUpdateProfile } from "@hera/data";
import { convertPhoneNumber } from "@hera/utils";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { NesConfirmationDialog, NesFormHelperText } from "@nestle/components";
import { useBreakPoint } from "@nestle/hooks";
import {
  updateUserProfileInitialValues,
  updateUserProfileValidations,
} from "@nestle/validations";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { get, isNil } from "lodash-es";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { NesUserChangePasswordModal } from "../modals/NesUserChangePasswordModal";

export interface IUpdateUserProfile
  extends Omit<
    IUserInfo,
    "id" | "isActive" | "isVerified" | "avatar" | "passwordBlank"
  > {}

const StyledTextField = styled(TextField)`
  .MuiInputLabel-root {
    color: ${({ theme }) => theme.palette.text.secondary};
    ${({ theme }) => theme.typography.body1};
    text-transform: none;
  }
`;

export const NesUserProfile: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const isPC = useBreakPoint("sm");

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
    <Box sx={{ maxWidth: "100%" }}>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
        }}
      >
        <Typography variant="h6" color="text.primary">
          {formatMessage({ id: "userSetting.userInfo" })}
        </Typography>
      </Box>
      <Divider flexItem />
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 1.5,
        }}
      >
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
                <Grid spacing={2} container sx={{ mb: 2 }}>
                  <Grid item sm={6} xs={12}>
                    <StyledTextField
                      size="small"
                      id="lastName"
                      variant="outlined"
                      name="lastName"
                      label={formatMessage({ id: "userSetting.lastName" })}
                      fullWidth
                      value={values.lastName}
                      onChange={(e) => {
                        setFieldValue("lastName", e.target.value);
                      }}
                      error={touched.lastName && Boolean(errors.lastName)}
                    />
                    <NesFormHelperText errors={errors} field={["lastName"]} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <StyledTextField
                      size="small"
                      id="firstName"
                      variant="outlined"
                      name="firstName"
                      label={formatMessage({ id: "userSetting.firstName" })}
                      fullWidth
                      value={values.firstName}
                      onChange={(e) => {
                        setFieldValue("firstName", e.target.value);
                      }}
                      error={touched.firstName && Boolean(errors.firstName)}
                    />
                    <NesFormHelperText errors={errors} field={["firstName"]} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      size="small"
                      id="phone"
                      variant="outlined"
                      name="phone"
                      label={formatMessage({ id: "userSetting.phone" })}
                      fullWidth
                      value={values.phone}
                      onChange={(e) => {
                        setFieldValue("phone", e.target.value);
                      }}
                      error={touched.phone && Boolean(errors.phone)}
                    />
                    <NesFormHelperText errors={errors} field={["phone"]} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      id="email"
                      variant="outlined"
                      name="email"
                      label={formatMessage({ id: "userSetting.email" })}
                      fullWidth
                      value={values.email}
                      disabled
                      error={touched.email && Boolean(errors.email)}
                    />
                    <NesFormHelperText errors={errors} field={["email"]} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      size="small"
                      select
                      label={formatMessage({ id: "userSetting.genders" })}
                      id="gender"
                      variant="outlined"
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
                          setFieldError("dob", "userSetting.invalidDob");
                        }

                        setFieldValue("dob", dayjs.utc(value).format());
                      }}
                      renderInput={(params) => (
                        <>
                          <StyledTextField
                            size="small"
                            {...params}
                            id="dob"
                            name="dob"
                            fullWidth
                            onChange={(e) => {
                              if (
                                dayjs
                                  .utc(e.target.value, "DD/MM/YYYY")
                                  .isSameOrAfter(dayjs(), "day")
                              ) {
                                setFieldError("dob", "userSetting.invalidDob");
                              } else {
                                setFieldError("dob", null);
                                setFieldValue(
                                  "dob",
                                  dayjs.utc(e.target.value).format(),
                                );
                              }
                            }}
                            label={formatMessage({
                              id: "userSetting.birthday",
                            })}
                            variant="outlined"
                            onClick={() => setOpenDob(true)}
                            error={touched.dob && Boolean(errors.dob)}
                          />
                          <NesFormHelperText errors={errors} field={["dob"]} />
                        </>
                      )}
                      inputFormat="dd/MM/yyyy"
                    />
                  </Grid>
                </Grid>
                {/* Will use later when login with Google and Facebook finished */}
                {/* <NesUserSocialConnect /> */}
                <Stack spacing={2} direction="row" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    fullWidth={!isPC}
                    onClick={() => {
                      setChangePasswordModalOpen(true);
                    }}
                  >
                    {formatMessage({ id: "userSetting.changePassword" })}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    fullWidth={!isPC}
                  >
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
                <NesUserChangePasswordModal
                  open={changePasswordModalOpen}
                  closeModal={() => {
                    setChangePasswordModalOpen(false);
                  }}
                />
              </Form>
            );
          }}
        </Formik>
        <NesConfirmationDialog
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
    </Box>
  );
};
