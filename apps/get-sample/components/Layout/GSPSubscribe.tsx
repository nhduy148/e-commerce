import { useBreakPoint } from "@gsp/hooks";
import { ISubscriptionPayload, useSubscribeEmailMutation } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import {
  ArrowForwardOutlined as ArrowForwardOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
} from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { GSPLoadingButton } from "../GSPLoadingButton";
import { GSPHomeServices } from "./GSPHomeServices";

export const GSPSubscribe = () => {
  const theme = useTheme();
  const { __ } = useFormatter();
  const isPC = useBreakPoint("sm");
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: subscribeEmail, isLoading: isSubscribingEmail } =
    useSubscribeEmailMutation();

  const subscriptionInitialValue: ISubscriptionPayload = {
    email: "",
  };

  const subscriptionValidation = Yup.object().shape({
    email: Yup.string()
      .email(__({ defaultMessage: "Email không đúng định dạng" }))
      .required(__({ defaultMessage: "Email không được để trống" })),
  });

  const handleSubmit = (
    formValues: ISubscriptionPayload,
    actions: FormikHelpers<ISubscriptionPayload>,
  ) => {
    subscribeEmail(
      { email: formValues.email },
      {
        onSuccess() {
          actions.resetForm({
            values: {
              email: "",
            },
          });
          enqueueSnackbar(`${__({ defaultMessage: "Đăng ký thành công" })}`, {
            variant: "success",
          });
        },
        onError() {
          enqueueSnackbar(
            `${__({
              defaultMessage: "Đăng ký thất bại, vui lòng thử lại sau",
            })}`,
            { variant: "error" },
          );
        },
      },
    );
  };

  return (
    <Box
      sx={{
        paddingTop: 5,
        paddingBottom: 8.75,
        color: theme.palette.common.black,
        backgroundColor: theme.palette.background.paper,
        paddingX: { sm: 0, xs: 3 },
        textAlign: "center",
      }}
    >
      <GSPHomeServices
        sx={{
          marginBottom: 7.5,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 4,
          paddingBottom: 5,
          px: { sm: 1.5, xs: 2 },
          backgroundColor: theme.palette.common.white,
          maxWidth: 606,
          mx: "auto",
          borderRadius: "6px",
          boxShadow: theme.shadows[5],
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 0.5 }}>
          {__({ defaultMessage: "Theo dõi chúng tôi" })}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: 4, color: theme.palette.grey[400] }}
        >
          {__({
            defaultMessage:
              "Hãy theo dõi chúng tôi để nhận bản tin & khuyến mãi mới nhất!",
          })}
        </Typography>

        <Formik
          initialValues={subscriptionInitialValue}
          validationSchema={subscriptionValidation}
          onSubmit={(
            value: ISubscriptionPayload,
            actions: FormikHelpers<ISubscriptionPayload>,
          ) => handleSubmit(value, actions)}
        >
          {({
            handleSubmit,
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
          }) => {
            return (
              <Box
                sx={{
                  width: 454,
                  maxWidth: "100%",
                }}
              >
                <Form onSubmit={handleSubmit}>
                  <Box
                    sx={{
                      display: { sm: "flex", xs: "block" },
                    }}
                  >
                    <TextField
                      size="small"
                      id="email"
                      name="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}
                      placeholder={__({ defaultMessage: "Địa chỉ email" })}
                      sx={{
                        borderRadius: "6px",
                        width: "100%",
                      }}
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <GSPLoadingButton
                      sx={{
                        marginLeft: { sm: "-5px", xs: 0 },
                        marginTop: { sm: 0, xs: 2 },
                        alignSelf: "flex-start",
                      }}
                      size="small"
                      type="submit"
                      endIcon={<ArrowForwardOutlinedIcon />}
                      variant="contained"
                      fullWidth={!isPC}
                      isLoading={isSubscribingEmail}
                    >
                      {__({ defaultMessage: "Gửi" })}
                    </GSPLoadingButton>
                  </Box>
                </Form>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};
