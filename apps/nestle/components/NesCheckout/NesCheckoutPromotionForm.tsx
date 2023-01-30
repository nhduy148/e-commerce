import {
  useApplyPromtion,
  useRefreshCart,
  useRemovePromtion,
} from "@hera/data";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { NesFormHelperText, NesLoadingButton } from "@nestle/components";
import { Form, Formik } from "formik";
import { FC, useState } from "react";
import { useIntl } from "react-intl";

interface IProps {
  promoCode?: string;
  enabled?: boolean;
}

export const NesCheckoutPromotionForm: FC<IProps> = ({
  promoCode,
  enabled,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const hasCode = promoCode?.length > 0 || false;
  const [isFieldChanged, setIsFieldChanged] = useState<boolean>(false);
  const pageContent = {
    promotionCode: formatMessage({ id: "checkoutPage.promotionCode" }),
    confirm: formatMessage({ id: "common.confirm" }),
    delete: formatMessage({ id: "common.delete" }),
    update: formatMessage({ id: "common.update" }),
    invalidPromotion: formatMessage({ id: "checkoutPage.invalidPromotion" }),
    usageLimitReached: formatMessage({ id: "checkoutPage.usageLimitReached" }),
    required: formatMessage({ id: "validations.common.required" }),
  };
  const { refetch } = useRefreshCart();
  const { mutateAsync: applyPromotion } = useApplyPromtion();
  const { mutateAsync: removePromotion } = useRemovePromtion();
  const handleSubmit = async (values, actions) => {
    if (values?.promoCode?.length <= 0) {
      actions.setFieldError("promoCode", pageContent.required);
      return;
    }
    actions.setSubmitting(true);
    try {
      if (!hasCode) {
        await applyPromotion(values);
      } else {
        await removePromotion();
        actions.setFieldValue("promoCode", null);
      }
      await refetch();
    } catch (error) {
      if (error.message === "promotion not found") {
        actions.setFieldError("promoCode", pageContent.invalidPromotion);
      } else if (error.message === "usage_limit_reached") {
        actions.setFieldError("promoCode", pageContent.usageLimitReached);
      } else {
        actions.setFieldError("promoCode", pageContent.invalidPromotion);
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ promoCode }}
      enableReinitialize
      onSubmit={handleSubmit}
      validateOnMount={false}
      validateOnChange={false}
    >
      {(props) => {
        const { setFieldValue, values, errors, isSubmitting } = props;
        return (
          <Form>
            {!hasCode && enabled ? (
              <>
                <TextField
                  fullWidth
                  label={pageContent.promotionCode}
                  value={values?.promoCode || ""}
                  onChange={(e) => {
                    setFieldValue("promoCode", e.target.value);
                    if (e.target.value.length > 0) {
                      setIsFieldChanged(true);
                    }
                    if (e.target.value.length === 0) {
                      setIsFieldChanged(false);
                    }
                  }}
                  size="small"
                  variant="outlined"
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
                />
                <NesFormHelperText errors={errors} field="promoCode" />
              </>
            ) : (
              <Box p={1} border="1px solid" borderColor="primary.main">
                <Typography variant="subtitle2" color="primary">
                  {promoCode}
                </Typography>
              </Box>
            )}
            {enabled && (
              <Box mt={1}>
                <NesLoadingButton
                  isLoading={isSubmitting}
                  disabled={!isFieldChanged}
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  {hasCode ? pageContent.delete : pageContent.confirm}
                </NesLoadingButton>
              </Box>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
