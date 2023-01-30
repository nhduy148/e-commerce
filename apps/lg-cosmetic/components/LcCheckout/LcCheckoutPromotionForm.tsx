import {
  useApplyPromtion,
  useRefreshCart,
  useRemovePromtion,
} from "@hera/data";
import { LcFormHelperText, LcLoadingButton } from "@lc/components";
import { Box, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { FC } from "react";
import { useIntl } from "react-intl";

interface IProps {
  promoCode?: string;
  enabled?: boolean;
}

export const LcCheckoutPromotionForm: FC<IProps> = ({ promoCode, enabled }) => {
  const { formatMessage } = useIntl();
  const hasCode = promoCode?.length > 0 || false;
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
      validateOnBlur={false}
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
                  onChange={(e) => setFieldValue("promoCode", e.target.value)}
                  size="small"
                  variant="outlined"
                />
                <LcFormHelperText errors={errors} field="promoCode" />
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
                <LcLoadingButton
                  isLoading={isSubmitting}
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="small"
                >
                  {hasCode ? pageContent.delete : pageContent.confirm}
                </LcLoadingButton>
              </Box>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
