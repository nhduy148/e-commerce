import { IGetSamplePayload, useGetSampleMutation } from "@hera/data";
import { AuthenticationAlert, InputField } from "@hera/ui";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  keyframes,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";
import { getSampleValidations, getSampleValues } from "@nestle/validations";
import { Form, Formik } from "formik";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";
import { NesFormHelperText } from "../NesFormHelperText";

const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to { opacity: 1;}
`;

const NesGetSampleFormComponent = () => {
  const theme = useTheme();
  const isPC = useBreakPoint("sm");
  const { formatMessage } = useIntl();
  const { mutate, isLoading } = useGetSampleMutation();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [type, setType] = useState<string>("child");
  const [sampleValue, setSampleValues] = useState(getSampleValues);
  const handleGetSampleRegister = (values: IGetSamplePayload) => {
    if (type === "child") {
      values.gestationalAge = "";
    }
    if (type === "gestational") {
      values.childAge = "";
    }

    if (values.email.length === 0) {
      values.email = null;
    }

    mutate(
      { ...values, type },
      {
        onSuccess() {
          setShowAlert(true);
          setType("child");
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        },
      },
    );
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };
  const translate = {
    title: formatMessage({ id: "getSample.title" }),
    subTitle: formatMessage({ id: "getSample.subTitle" }),
    contactName: formatMessage({ id: "getSample.contactName" }),
    phoneNumber: formatMessage({ id: "getSample.phoneNumber" }),
    type: formatMessage({ id: "getSample.type" }),
    gestational: formatMessage({ id: "getSample.gestational" }),
    gestationalAge: formatMessage({ id: "getSample.GestationalAge" }),
    child: formatMessage({ id: "getSample.child" }),
    childAge: formatMessage({ id: "getSample.childAge" }),
    sendForm: formatMessage({ id: "getSample.sendForm" }),
    alertSuccess: formatMessage({ id: "getSample.alertSuccess" }),
  };
  return (
    <Grid container display="flex">
      <Grid item sm={6} xs={12} m="auto">
        <Box
          sx={{ backgroundColor: theme.palette.custom.getSampleFormColor }}
          px={2}
          py={isPC ? "16px" : "36px"}
          borderRadius={isPC ? "10px" : 0}
          mx={isPC ? 0 : "-16px"}
        >
          <Box>
            <Box>
              <Typography variant="h5" color={theme.palette.primary.main}>
                {translate.title}
              </Typography>
              <Typography variant="body1" mt={isPC ? 0 : "12px"}>
                {translate.subTitle}
              </Typography>
            </Box>
            <Box>
              <Formik
                initialValues={sampleValue}
                validationSchema={getSampleValidations}
                onSubmit={async (values, { resetForm }) => {
                  // @ts-ignore
                  handleGetSampleRegister(values);
                  setTimeout(() => {
                    resetForm({
                      // @ts-ignore
                      name: "",
                      phone: "",
                      email: "",
                      gestationalAge: "",
                      childAge: "",
                    });
                  }, 500);
                }}
                validateOnBlur={false}
                validateOnMount={false}
                validateOnChange={false}
                enableReinitialize
              >
                {(props) => {
                  const { values, setFieldValue, handleSubmit, errors } = props;
                  return (
                    <Form onSubmit={handleSubmit}>
                      <Box my={isPC ? "20px" : "32px"}>
                        <Box>
                          <InputField
                            id="name"
                            name="name"
                            type="text"
                            label={translate.contactName}
                            error={Boolean(errors.name)}
                            value={values.name}
                            onChange={(e) => {
                              setFieldValue("name", e.target.value.trimLeft());
                            }}
                            fullWidth
                            sx={{
                              input: {
                                color: theme.palette.common.black,
                              },
                            }}
                            variant="outlined"
                            size={isPC ? "small" : "medium"}
                          />

                          <NesFormHelperText errors={errors} field={["name"]} />
                        </Box>
                        <Box mt="12px">
                          <InputField
                            id="phone"
                            name="phone"
                            type="text"
                            label={translate.phoneNumber}
                            error={Boolean(errors.phone)}
                            value={values.phone}
                            onChange={(e) => {
                              setFieldValue("phone", e.target.value);
                            }}
                            fullWidth
                            sx={{
                              input: {
                                color: theme.palette.common.black,
                              },
                            }}
                            variant="outlined"
                            size={isPC ? "small" : "medium"}
                          />

                          <NesFormHelperText
                            errors={errors}
                            field={["phone"]}
                          />
                        </Box>
                        <Box mt="12px">
                          <InputField
                            id="email"
                            name="email"
                            type="text"
                            label="Email"
                            error={Boolean(errors.email)}
                            value={values.email}
                            onChange={(e) => {
                              setFieldValue("email", e.target.value.trim());
                            }}
                            fullWidth
                            sx={{
                              input: {
                                color: theme.palette.common.black,
                              },
                            }}
                            variant="outlined"
                            size={isPC ? "small" : "medium"}
                          />

                          <NesFormHelperText
                            errors={errors}
                            field={["email"]}
                          />
                        </Box>
                        <Box mt="12px">
                          <FormControl>
                            <Box
                              display={isPC ? "flex" : "block"}
                              alignItems="center"
                            >
                              <Typography>{translate.type}</Typography>
                              <RadioGroup
                                row
                                sx={{ ml: { sm: "45px", xs: "0" } }}
                                onChange={handleChangeType}
                                value={type}
                              >
                                <FormControlLabel
                                  value="gestational"
                                  control={
                                    <Radio
                                      size="small"
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 16,
                                        },
                                      }}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2">
                                      {translate.gestational}
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  value="child"
                                  control={
                                    <Radio
                                      size="small"
                                      sx={{
                                        "& .MuiSvgIcon-root": {
                                          fontSize: 16,
                                        },
                                      }}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2">
                                      {translate.child}
                                    </Typography>
                                  }
                                />
                              </RadioGroup>
                            </Box>
                          </FormControl>
                        </Box>
                        <Box mt="12px">
                          <InputField
                            id={
                              type === "child" ? "childAge" : "gestationalAge"
                            }
                            name={
                              type === "child" ? "childAge" : "gestationalAge"
                            }
                            type="text"
                            label={
                              type === "child"
                                ? translate.childAge
                                : translate.gestationalAge
                            }
                            value={
                              type === "child"
                                ? values.childAge
                                : values.gestationalAge
                            }
                            onChange={(e) => {
                              setFieldValue(
                                type === "child"
                                  ? "childAge"
                                  : "gestationalAge",
                                e.target.value,
                              );
                            }}
                            fullWidth
                            sx={{
                              input: {
                                color: theme.palette.common.black,
                              },
                            }}
                            variant="outlined"
                            size={isPC ? "small" : "medium"}
                          />
                        </Box>
                      </Box>

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
                          <Typography variant="body1">
                            {translate.sendForm}
                          </Typography>
                        )}
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Box>
        </Box>
        <Box mx={isPC ? "-25px" : "0"} mt={2}>
          {showAlert && (
            <Box
              sx={{
                animation: `${fadeIn} ease-in  .5s`,
              }}
            >
              <AuthenticationAlert
                alertText={translate.alertSuccess}
                alertType="success"
              />
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export const NesGetSampleForm = memo(NesGetSampleFormComponent, isEqual);
