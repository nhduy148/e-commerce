import { useSubscribeEmailMutation } from "@hera/data";
import { SubscriptionBackground } from "@lc/static/images";
import {
  subscriptionInitialValue,
  subscriptionValidation,
} from "@lc/validations";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  lighten,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { LcLogo } from "@lc/components";
import { useBreakPoint } from "@lc/hooks";
import { Form, Formik } from "formik";
import { FunctionComponent, memo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const LcSubscribeSectionContainer = styled(Container)`
  background-color: ${({ theme }) => lighten(theme.palette.primary.main, 0.9)};
  margin-left: auto;
  color: ${({ theme }) => theme.palette.grey[900]};

  background-position: left top;
  background-size: cover;
  background-repeat: no-repeat;
`;

const SubscriptionTextField = styled(TextField)`
  background-color: ${({ theme }) => theme.palette.common.white};
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

const LcSubscribeSectionComponent: FunctionComponent = ({}) => {
  const isPC = useBreakPoint("sm");
  const { formatMessage } = useIntl();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const translate = {
    title: formatMessage({ id: "subscribeSection.title" }),
    description: formatMessage({ id: "subscribeSection.description" }),
    successTitle: formatMessage({ id: "subscribeSection.successTitle" }),
    successMessage: formatMessage({ id: "subscribeSection.successMessage" }),
    close: formatMessage({ id: "common.close" }),
    register: formatMessage({ id: "common.register" }),
  };
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
    <LcSubscribeSectionContainer
      maxWidth="xl"
      sx={{
        padding: { sm: 9, xs: "30px 22px" },
        color: "text.main",
        background: `url(${`${SubscriptionBackground.src}`}) center/cover`,
      }}
    >
      <Stack
        direction={{ sm: "row", xs: "column" }}
        spacing={{ xs: 2, sm: 5, md: 9 }}
      >
        <Box maxWidth={{ xs: 220, md: 300 }} m="auto">
          <LcLogo color="gray" />
        </Box>
        <Box flex={1} textAlign={{ sm: "left", xs: "center" }}>
          <Typography
            textTransform="uppercase"
            sx={{ mb: 1, typography: { sm: "h4", xs: "h5" } }}
          >
            {translate.title}
          </Typography>
          <Typography
            sx={{ mb: 4, typography: { sm: "subtitle1", xs: "subtitle2" } }}
          >
            {translate.description}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      error ? error : touched.email && Boolean(errors.email)
                    }
                    helperText={touched.email && errors.email}
                    size="small"
                    fullWidth
                    sx={{
                      maxWidth: 355,
                      mr: isPC ? 1 : 0,
                    }}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    size="small"
                    fullWidth={isPC}
                    sx={{
                      maxWidth: 180,
                      whiteSpace: "nowrap",
                      flex: !isPC ? "1 1 120px" : "unset",
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress
                        sx={{ color: "common.white" }}
                        size="20px"
                      />
                    ) : (
                      translate.register
                    )}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
      <SubscribeDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h6">{translate.successTitle}</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{translate.successMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            {translate.close}
          </Button>
        </DialogActions>
      </SubscribeDialog>
    </LcSubscribeSectionContainer>
  );
};

export const LcSubscribeSection = memo(LcSubscribeSectionComponent, isEqual);
