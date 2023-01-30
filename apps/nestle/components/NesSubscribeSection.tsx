import { useSubscribeEmailMutation } from "@hera/data";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  lighten,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { SubscriptionBackground } from "@nestle/static/images";
import {
  subscriptionInitialValue,
  subscriptionValidation,
} from "@nestle/validations";
import { Form, Formik } from "formik";
import { FunctionComponent, memo, useState } from "react";
import isEqual from "react-fast-compare";

const NesSubscribeSectionContainer = styled(Container)`
  background-color: ${({ theme }) => lighten(theme.palette.primary.main, 0.9)};
  margin-left: auto;
  color: ${({ theme }) => theme.palette.grey[900]};

  background-position: left top;
  background-size: cover;
  background-repeat: no-repeat;
`;

const SubscriptionTextField = styled(TextField)`
  background-color: ${({ theme }) => theme.palette.common.white};
  margin-right: 8px;
  height: 40px;

  .MuiFormHelperText-root {
    font-size: 12px;
    margin-top: 0px;
  }
`;

const SubscribeDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
    padding: 24px;
  }

  .MuiDialog-paper {
    border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  }

  .MuiDialogContent-root {
    padding-top: 24px !important;
    padding: 24px;
  }

  .MuiDialogActions-root {
    padding: 0 24px 24px 24px;
    display: flex;
    justify-content: space-between;
  }

  .MuiDialogActions-root {
    justify-content: flex-end;
  }
`;

const NesSubscribeSectionComponent: FunctionComponent = ({}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { mutate } = useSubscribeEmailMutation();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    mutate(
      { ...values },
      {
        onError() {
          setError(true);
        },

        async onSuccess() {
          setIsSubmitting(false);
          setDialogOpen(true);
        },
      },
    );
  };

  return (
    <NesSubscribeSectionContainer
      maxWidth="xl"
      sx={{
        padding: { sm: "78px", xs: "20px 16px" },
        color: "text.main",
        backgroundImage: {
          sm: `url(${`${SubscriptionBackground.src}`})`,
          xs: "none",
        },
      }}
    >
      <Grid container>
        <Grid item lg={4} md={4} sm={3} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={9} xs={12}>
          <Typography
            textTransform="uppercase"
            sx={{ mb: 1, typography: { sm: "h4", xs: "h5" } }}
          >
            Theo dõi chúng tôi
          </Typography>
          <Typography
            sx={{ mb: 4, typography: { sm: "subtitle1", xs: "subtitle2" } }}
          >
            Hãy theo dõi chúng tôi để nhận bản tin & khuyến mãi mới nhất
          </Typography>
          <Formik
            initialValues={subscriptionInitialValue}
            validationSchema={subscriptionValidation}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
            validateOnBlur={false}
            validateOnMount={false}
          >
            {({ handleSubmit, handleChange, handleBlur, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", maxWidth: "550px" }}>
                  <SubscriptionTextField
                    label="Địa chỉ Email"
                    type="email"
                    name="email"
                    placeholder="example@123.com"
                    sx={{ flex: 8 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      error ? error : touched.email && Boolean(errors.email)
                    }
                    helperText={touched.email && errors.email}
                    size="small"
                  />
                  <Button
                    variant="contained"
                    sx={{ flex: 2 }}
                    type="submit"
                    size="small"
                  >
                    {isSubmitting ? (
                      <CircularProgress
                        sx={{ color: "common.white" }}
                        size="20px"
                      />
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
      <SubscribeDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h6">
            Chúc mừng bạn đã đăng kí thành công
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Chúng tôi sẽ gửi thông tin cho bạn sớm nhất
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </SubscribeDialog>
    </NesSubscribeSectionContainer>
  );
};

export const NesSubscribeSection = memo(NesSubscribeSectionComponent, isEqual);
