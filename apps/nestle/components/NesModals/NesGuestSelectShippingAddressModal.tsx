import {
  IShippingAndBillingAddressPayload,
  IShippingAndBillingAddressShape,
  useEstimateShippingCost,
  useGetLocation,
  useRefreshCart,
  useSelectShippingAndBillingAddress,
} from "@hera/data";
import { convertPhoneNumber } from "@hera/utils";
import {
  Box,
  Dialog,
  DialogProps,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Select from "@mui/material/Select";
import {
  NesAlert,
  NesFormHelperText,
  NesIconButton,
  NesLoadingButton,
} from "@nestle/components";
import { splitFullName } from "@nestle/utils";
import {
  selectShippingAndBillingValidations,
  selectShippingInfoInitialValues,
} from "@nestle/validations";
import { Form, Formik, FormikHelpers } from "formik";
import { isNil } from "lodash-es";
import { useSnackbar } from "notistack";
import { FC, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

interface IProps extends Omit<DialogProps, "children" | "onClose"> {
  onSuccess?: (data?: IShippingAndBillingAddressPayload) => void;
  shippingAddress?: IShippingAndBillingAddressShape;
}

const FormBox = styled(Box)`
  .MuiFormLabel-asterisk {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;

const initSelectedIds = {
  provinceId: null,
  districtId: null,
  wardId: null,
};

export const NesGuestSelectShippingAddressModal: FC<IProps> = ({
  onSuccess,
  shippingAddress,
  ...props
}) => {
  const [isFailure, setIsFailure] = useState<boolean>(false);
  const { mutateAsync: selectShippingAndBillingAddress } =
    useSelectShippingAndBillingAddress();
  const { setData: setRefreshCartData } = useRefreshCart();
  const { refetch: refetchShippingCost } = useEstimateShippingCost();
  const { formatMessage } = useIntl();
  const [selectedIds, setSelectedIds] = useState(initSelectedIds);
  const isGetAllLocationData = useMemo(
    () =>
      !!selectedIds.provinceId &&
      !!selectedIds.districtId &&
      !!selectedIds.wardId,
    [selectedIds],
  );
  const { data: addressData, isLoading: isLocationLoading } = useGetLocation(
    selectedIds,
    isGetAllLocationData,
  );
  const { enqueueSnackbar } = useSnackbar();
  const isEditable = Boolean(shippingAddress);
  const theme = useTheme();

  useEffect(() => {
    if (shippingAddress && isEditable && props.open === true) {
      const provinceId = shippingAddress.provinceId || null;
      const districtId = shippingAddress.districtId || null;
      const wardId = shippingAddress.wardId || null;
      setSelectedIds({
        provinceId,
        districtId,
        wardId,
      });
    }
  }, [shippingAddress, props.open]);

  const shippingAddressPayload = useMemo(() => {
    if (shippingAddress && isEditable) {
      const fullName = [shippingAddress.firstName, shippingAddress.lastName]
        .filter(Boolean)
        .join(" ");
      return {
        ...shippingAddress,
        fullName,
      };
    }
    return { fullName: "", ...selectShippingInfoInitialValues };
  }, [shippingAddress, isEditable]);

  const translate = {
    title: formatMessage({
      id: "modals.guestSelectShippingAnđBillingAddress.title",
    }),
    buyerInfo: formatMessage({ id: "modals.shippingInfo.clientInfo" }),
    addressInfo: formatMessage({ id: "modals.shippingInfo.addressInfo" }),
    setAsDefault: formatMessage({ id: "modals.shippingInfo.setAsDefault" }),
    fullName: formatMessage({ id: "common.fullName" }),
    phone: formatMessage({ id: "common.phone" }),
    email: formatMessage({ id: "common.email" }),
    province: formatMessage({ id: "common.province" }),
    district: formatMessage({ id: "common.district" }),
    address: formatMessage({ id: "common.address" }),
    ward: formatMessage({ id: "common.ward" }),
    confirm: formatMessage({ id: "common.confirm" }),
    createFailure: formatMessage(
      {
        id: "modals.guestSelectShippingAnđBillingAddress.createFailure",
      },
      {
        br: <br />,
      },
    ),
    createSuccess: formatMessage({
      id: "modals.guestSelectShippingAnđBillingAddress.createSuccess",
    }),
    invalidFullName: formatMessage({
      id: "validations.common.invalidFullName",
    }),
    donotContainSpecialCharacters: formatMessage({
      id: "validations.common.donotContainSpecialCharacters",
    }),
    somethingWentWrong: formatMessage({ id: "common.somethingWentWrong" }),
  };

  const handleSubmit = async (
    values: IShippingAndBillingAddressPayload,
    actions: FormikHelpers<IShippingAndBillingAddressPayload>,
  ) => {
    actions.setSubmitting(true);
    try {
      values.phone = convertPhoneNumber(values?.phone);
      const data = await selectShippingAndBillingAddress(values);
      setIsFailure(false);
      enqueueSnackbar(translate.createSuccess, {
        variant: "success",
      });
      actions.resetForm({
        values: selectShippingInfoInitialValues,
      });
      setRefreshCartData(data);
      await refetchShippingCost();
      onSuccess && onSuccess(values);
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
        setIsFailure(true);
      }
    } finally {
      actions.setSubmitting(true);
    }
  };

  const handleReset = () => {
    setSelectedIds(initSelectedIds);
  };

  return (
    <>
      <Dialog
        {...props}
        TransitionProps={{
          unmountOnExit: true,
          mountOnEnter: true,
        }}
        maxWidth="lg"
        PaperProps={{
          elevation: 0,
          sx: {
            borderTop: "4px solid",
            borderColor: "primary.main",
            width: 1,
            maxWidth: 735,
          },
        }}
      >
        <Box>
          <Box pt={2.5} pb={2} px={2} position="relative">
            <Typography variant="h6" color="text.main">
              {translate.title}
            </Typography>
            <NesIconButton
              iconName="close"
              onClick={() => onSuccess && onSuccess()}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Box>
          <Divider />
          <Formik
            initialValues={shippingAddressPayload}
            validationSchema={selectShippingAndBillingValidations}
            onSubmit={handleSubmit}
            onReset={handleReset}
            validateOnBlur={false}
            validateOnMount={false}
            validateOnChange={false}
            enableReinitialize
          >
            {(props) => {
              const {
                setFieldValue,
                setFieldError,
                values,
                errors,
                isSubmitting,
              } = props;

              return (
                <Form>
                  <Box px={2} py={1.5}>
                    <FormBox>
                      <Box mb={1.5}>
                        <Typography variant="subtitle1" color="primary.main">
                          {translate.buyerInfo}
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12}>
                            <TextField
                              InputProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: theme.palette.text.secondary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              size="small"
                              variant="outlined"
                              id="displayName"
                              label={translate.fullName}
                              // @ts-ignore
                              defaultValue={values.displayName}
                              // @ts-ignore
                              value={values.displayName}
                              name="displayName"
                              type="text"
                              fullWidth
                              required
                              onChange={(e) => {
                                const fullName = e.target.value.trimLeft();
                                setFieldValue("displayName", fullName);
                                setFieldValue("fullName", fullName);
                                const { firstName, lastName } =
                                  splitFullName(fullName);

                                setFieldValue("firstName", firstName);
                                setFieldValue("lastName", lastName);
                              }}
                            />
                            <NesFormHelperText
                              errors={errors}
                              field="fullName"
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              InputProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: theme.palette.text.secondary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              size="small"
                              variant="outlined"
                              id="email"
                              label={translate.email}
                              type="email"
                              name="email"
                              fullWidth
                              required
                              defaultValue={values.email}
                              value={values.email}
                              onChange={(e) =>
                                setFieldValue("email", e.target.value)
                              }
                            />
                            <NesFormHelperText errors={errors} field="email" />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              InputProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: theme.palette.text.secondary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              size="small"
                              variant="outlined"
                              id="phone"
                              label={translate.phone}
                              type="tel"
                              name="phone"
                              fullWidth
                              required
                              defaultValue={values.phone}
                              value={values.phone}
                              onChange={(e) =>
                                setFieldValue("phone", e.target.value)
                              }
                            />
                            <NesFormHelperText errors={errors} field="phone" />
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider />
                      <Box mt={1.5}>
                        <Typography variant="subtitle1" color="primary.main">
                          {translate.addressInfo}
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item sm={6} xs={12}>
                            <FormControl
                              variant="outlined"
                              sx={{ width: "100%" }}
                            >
                              <InputLabel
                                sx={{
                                  fontSize: theme.typography.body1.fontSize,
                                  top: "-6px",
                                }}
                                id="province-label"
                                required
                              >
                                {translate.province}
                              </InputLabel>
                              <Select
                                size="small"
                                disabled={isLocationLoading}
                                labelId="province-label"
                                id="province"
                                name="province"
                                required
                                defaultValue={values.provinceId}
                                value={values.provinceId}
                                onChange={(e) => {
                                  const provinceId = e.target.value;
                                  setFieldValue("provinceId", provinceId);
                                  setFieldValue(
                                    "province",
                                    addressData?.provinces?.find(
                                      (province) =>
                                        Number(province.id) === provinceId,
                                    )?.name || "",
                                  );
                                  setFieldValue("districtId", "");
                                  setFieldValue("district", "");
                                  setFieldValue("wardId", "");
                                  setFieldValue("ward", "");
                                  setSelectedIds({
                                    provinceId,
                                    districtId: null,
                                    wardId: null,
                                  });
                                }}
                                label={translate.province}
                              >
                                {addressData?.provinces?.map((item) => {
                                  return (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              <NesFormHelperText
                                errors={errors}
                                field="provinceId"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <FormControl
                              variant="outlined"
                              sx={{ width: "100%" }}
                            >
                              <InputLabel
                                id="district-label"
                                sx={{
                                  fontSize: theme.typography.body1.fontSize,
                                  top: "-6px",
                                }}
                                required
                              >
                                {translate.district}
                              </InputLabel>
                              <Select
                                size="small"
                                disabled={isLocationLoading}
                                labelId="district-label"
                                id="district"
                                defaultValue={values.districtId}
                                value={values.districtId}
                                onChange={(e) => {
                                  const districtId = e.target.value;
                                  setFieldValue("districtId", districtId);
                                  setFieldValue(
                                    "district",
                                    addressData?.districts?.find(
                                      (district) =>
                                        Number(district.id) === districtId,
                                    )?.name || "",
                                  );
                                  setFieldValue("wardId", "");
                                  setFieldValue("ward", "");
                                  setSelectedIds((ids) => ({
                                    ...ids,
                                    districtId,
                                    wardId: null,
                                  }));
                                }}
                                label={translate.district}
                                required
                              >
                                {addressData?.districts?.map((item) => {
                                  return (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              <NesFormHelperText
                                errors={errors}
                                field="districtId"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <FormControl
                              variant="outlined"
                              sx={{ width: "100%" }}
                            >
                              <InputLabel
                                sx={{
                                  fontSize: theme.typography.body1.fontSize,
                                  top: "-6px",
                                }}
                                id="ward-label"
                                required
                              >
                                {translate.ward}
                              </InputLabel>
                              <Select
                                size="small"
                                disabled={isLocationLoading}
                                labelId="ward-label"
                                id="ward"
                                defaultValue={values.wardId}
                                value={values.wardId}
                                onChange={(e) => {
                                  const wardId = e.target.value;
                                  setFieldValue("wardId", wardId);
                                  setFieldValue(
                                    "ward",
                                    addressData?.wards?.find(
                                      (ward) => Number(ward.id) === wardId,
                                    )?.name || "",
                                  );
                                  setSelectedIds((ids) => ({
                                    ...ids,
                                    wardId,
                                  }));
                                }}
                                label={translate.ward}
                                required
                              >
                                {addressData?.wards?.map((item) => {
                                  return (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              <NesFormHelperText
                                errors={errors}
                                field="wardId"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              InputProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              InputLabelProps={{
                                required: true,
                                sx: {
                                  color: theme.palette.text.secondary,
                                  fontSize: theme.typography.body1.fontSize,
                                },
                              }}
                              size="small"
                              label={translate.address}
                              variant="outlined"
                              fullWidth
                              id="addressLine1"
                              name="addressLine1"
                              defaultValue={values.addressLine1}
                              value={values.addressLine1}
                              onChange={(e) =>
                                setFieldValue(
                                  "addressLine1",
                                  e.target.value.trimLeft(),
                                )
                              }
                              required
                            />
                            <NesFormHelperText
                              errors={errors}
                              field="addressLine1"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </FormBox>
                  </Box>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                  >
                    <NesLoadingButton
                      isLoading={isSubmitting}
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      {translate.confirm}
                    </NesLoadingButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Dialog>
      <NesAlert
        title={translate.somethingWentWrong}
        open={isFailure}
        onClose={() => setIsFailure(false)}
      >
        {translate.createFailure}
      </NesAlert>
    </>
  );
};
