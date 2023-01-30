import { GSPLoadingButton } from "@gsp/components";
import {
  customerInfoInitialValues,
  customerInfoValidations,
} from "@gsp/validations";
import {
  IFormDynamicContent,
  IFormSection,
  IProductDetail,
  useSubmitSurveyFormMutation,
} from "@hera/data";
import { useFormatter } from "@hera/i18n";
import { convertPhoneNumber } from "@hera/utils";
import {
  Box,
  Card,
  Checkbox,
  Container,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { isNil } from "lodash-es";
import { useSnackbar } from "notistack";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import { ObjectSchema } from "yup";
import { GSPDynamicForm } from "./GSPDynamicForm";
import { GSPShippingForm } from "./GSPShippingForm";
import { GSPSuccessModalContent } from "./GSPSuccessModalContent";

const FormBox = styled(Form)`
  .MuiFormLabel-asterisk {
    color: ${({ theme }) => theme.palette.error.main};
  }
  .MuiFormControlLabel-root {
    align-items: flex-start;
    margin-top: 12px;
  }
  .MuiRadio-root,
  .MuiCheckbox-root {
    padding-top: 0;
    padding-bottom: 0;
    ~ .MuiFormControlLabel-label {
      word-break: break-word;
    }
  }
  .MuiFormControlTextField-root {
    .MuiFormControlTextFieldItem-root,
    > .MuiInputBase-root {
      margin-top: 12px;
    }
  }

  .MuiSelect-root {
    margin-top: 12px;
    legend > span {
      display: none;
    }
  }
`;

function createYupSchema(schema, { id, validations }: IFormSection) {
  Object.entries(validations || {}).forEach(([key, value]) => {
    let validator = yup["string"]();
    if (!validator[key]) {
      return;
    }
    if (key === "required" && value === true) {
      validator = validator["required"]("validations.common.required");
    }

    schema[id] = validator;
  });
  return schema;
}

interface IProps {
  formSections: IFormSection[];
  productDetails: IProductDetail;
  questionFormId: number;
}

const baseValidationSchema = yup.object().shape({});

const initialValues = {
  customerInfo: customerInfoInitialValues,
  customerAnswer: {},
};

export const GSPProductDetailSurveyForm: FC<IProps> = ({
  formSections,
  productDetails,
  questionFormId,
}) => {
  const { __ } = useFormatter();
  const { enqueueSnackbar } = useSnackbar();
  const successRef = useRef<any>();
  const [successModalOpened, setOpenSuccessModal] = useState(false);
  const { palette } = useTheme();
  const [surveyValidationSchema, setSurveyValidationSchema] =
    useState<ObjectSchema<any>>();
  const { mutateAsync: submitSurveyFormAsync } = useSubmitSurveyFormMutation();

  const validateSchema = useMemo(
    () =>
      baseValidationSchema
        .concat(customerInfoValidations)
        .concat(surveyValidationSchema),
    [surveyValidationSchema],
  );

  useEffect(() => {
    if (Array.isArray(formSections) && formSections.length > 0) {
      const yepSchema = formSections.reduce(createYupSchema, {});
      setSurveyValidationSchema(
        yup.object().shape({
          customerAnswer: yup.object().shape(yepSchema).nullable(),
        }),
      );
    }
  }, [formSections]);

  const handleSubmit = useCallback(
    async (
      values: IFormDynamicContent,
      actions: FormikHelpers<IFormDynamicContent>,
    ) => {
      actions.setSubmitting(true);
      try {
        if (productDetails.inStock <= 0) {
          throw new Error(__({ defaultMessage: "Sản phẩm hết hàng" }));
        }
        if (isNil(productDetails.id)) {
          throw new Error(__({ defaultMessage: "Missing product id" }));
        }
        values.customerInfo.phone = convertPhoneNumber(
          values.customerInfo.phone,
        );

        const customerAnswer = Object.entries(values?.customerAnswer || {}).map(
          ([id, value]) => {
            const currentForm = formSections.find((form) => form.id === id);
            if (!currentForm) {
              return null;
            } else {
              let answer = value;
              if (currentForm.type === "checkbox") {
                answer = JSON.parse(value || "[]").map((item) => item.value);
              } else if (
                currentForm.type === "textfield" &&
                currentForm.options.length > 0
              ) {
                answer = JSON.parse(value || "[]").map(
                  ({ question, answer }) => ({ question, answer }),
                );
              } else if (currentForm.type === "select") {
                currentForm.options.forEach((option) => {
                  if (value === option.id) {
                    answer = option.value;
                  }
                });
              } else {
                answer = value;
              }

              return { question: currentForm.label, answer, id };
            }
          },
        );

        if (isNil(customerAnswer)) {
          throw new Error(__({ defaultMessage: "Missing customer answers" }));
        }

        const sortedIds = formSections.map((x) => x.id);
        customerAnswer.sort(function (a, b) {
          return sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id);
        });

        await submitSurveyFormAsync({
          content: {
            customerInfo: values.customerInfo,
            customerAnswer,
          },
          productId: productDetails.id,
          questionFormId,
          quantity: 1,
        });

        actions.resetForm({
          values: initialValues,
        });
        setOpenSuccessModal(() => {
          if (successRef.current) {
            clearTimeout(successRef.current);
          }
          successRef.current = setTimeout(function () {
            setOpenSuccessModal(false);
          }, 5000);

          return true;
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
          enqueueSnackbar(error.message, { variant: "error" });
        }
      } finally {
        actions.setSubmitting(true);
      }
    },
    [productDetails.id, questionFormId],
  );

  return (
    <Box py={{ xs: 5, sm: 9, backgroundColor: palette.background.paper }}>
      <Container>
        <Card
          elevation={1}
          sx={{
            py: { xs: 2, sm: 5 },
            px: { xs: 2, sm: 9 },
            backgroundColor: palette.background.default,
          }}
        >
          <Box mb={{ xs: 2, sm: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
              {__({ defaultMessage: "Đăng ký nhận thử miễn phí sản phẩm" })}
            </Typography>
            <Typography color="textSecondary" textAlign="center">
              {__({
                defaultMessage:
                  "Vui lòng nhập đầy đủ thông tin để chúng tôi gửi sản phẩm đến bạn được nhanh chóng",
              })}
            </Typography>
          </Box>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validateOnMount={false}
            validateOnChange={false}
            enableReinitialize
          >
            {(props) => {
              return (
                <FormBox>
                  <Grid container spacing={2.5}>
                    {!successModalOpened && (
                      <GSPDynamicForm {...props} fields={formSections} />
                    )}
                    <GSPShippingForm
                      {...props}
                      formSectionLength={formSections?.length ?? 0}
                    />
                    {!successModalOpened && (
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <FormControlLabel
                            control={<Checkbox required defaultChecked />}
                            label={__({
                              defaultMessage:
                                "Tôi đồng ý nhận tin tức và khuyến mãi từ Abbott.",
                            })}
                          />
                        </FormControl>
                        <FormControl fullWidth>
                          <FormControlLabel
                            control={<Checkbox required defaultChecked />}
                            label={__({
                              defaultMessage:
                                "Tôi chấp nhận những nhiệm vụ của cuộc thử nghiệm này.",
                            })}
                          />
                        </FormControl>
                      </Grid>
                    )}

                    <Grid
                      item
                      xs={12}
                      justifyContent={{ xs: "stretch", sm: "flex-end" }}
                      display="flex"
                    >
                      <GSPLoadingButton
                        isLoading={props?.isSubmitting}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        variant="contained"
                        size="large"
                        type="submit"
                        endIcon={
                          <Icon>
                            {productDetails.inStock <= 0
                              ? "sentiment_very_dissatisfied"
                              : "arrow_forward"}
                          </Icon>
                        }
                        disabled={productDetails.inStock <= 0}
                      >
                        {productDetails.inStock <= 0
                          ? __({ defaultMessage: "Hàng đang về" })
                          : __({ defaultMessage: "Đăng kí dùng thử" })}
                      </GSPLoadingButton>
                    </Grid>
                  </Grid>
                </FormBox>
              );
            }}
          </Formik>
        </Card>
      </Container>
      <Dialog
        open={successModalOpened}
        TransitionProps={{ unmountOnExit: true, mountOnEnter: true }}
        BackdropProps={{ style: { backgroundColor: "white" } }}
        fullWidth
      >
        {successModalOpened && (
          <GSPSuccessModalContent
            onOk={() => {
              if (successRef.current) {
                clearTimeout(successRef.current);
              }
              setOpenSuccessModal(false);
            }}
          />
        )}
      </Dialog>
    </Box>
  );
};
