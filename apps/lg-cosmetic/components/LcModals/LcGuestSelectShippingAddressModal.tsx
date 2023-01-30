import {
  IShippingAndBillingAddressPayload,
  IShippingAndBillingAddressShape,
  useEstimateShippingCost,
  useGetLocation,
  useRefreshCart,
  useSelectShippingAndBillingAddress,
} from "@hera/data";
import { convertPhoneNumber, isSpecialCharacterRegex } from "@hera/utils";
import {
  LcAlert,
  LcFormHelperText,
  LcIconButton,
  LcLoadingButton,
} from "@lc/components";
import { gtmEvent } from "@lc/libs";
import { splitFullname } from "@lc/utils";
import {
  selectShippingAndBillingValidations,
  selectShippingInfoInitialValues,
} from "@lc/validations";
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
} from "@mui/material";
import Select from "@mui/material/Select";
import { Form, Formik, FormikHelpers } from "formik";
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

export const LcGuestSelectShippingAddressModal: FC<IProps> = ({
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
    const { phone } = values;
    values.phone = convertPhoneNumber(phone);
    if (isSpecialCharacterRegex.test(values.phone)) {
      actions.setFieldError("phone", "validations.common.invalidPhoneNumber");
      return;
    }
    try {
      gtmEvent("add_shipping_info", values);
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
      setIsFailure(true);
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
            <Typography variant="h5" textTransform="uppercase">
              {translate.title}
            </Typography>
            <LcIconButton
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
                  <Box px={2} py={3}>
                    <FormBox>
                      <Box mb={3}>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          textTransform="uppercase"
                        >
                          {translate.buyerInfo}
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12}>
                            <TextField
                              id="fullName"
                              label={translate.fullName}
                              // @ts-ignore
                              defaultValue={values.fullName}
                              // @ts-ignore
                              value={values.fullName}
                              name="fullName"
                              type="text"
                              variant="standard"
                              fullWidth
                              required
                              onChange={(e) => {
                                const fullName = e.target.value.trimLeft();
                                setFieldValue("displayName", fullName);
                                setFieldValue("fullName", fullName);
                                const { error, firstName, lastName } =
                                  splitFullname(fullName);
                                if (error === null) {
                                  setFieldValue("firstName", firstName);
                                  setFieldValue("lastName", lastName);
                                }
                                setFieldError("fullName", error);
                              }}
                              InputLabelProps={{ required: true }}
                            />
                            <LcFormHelperText
                              errors={errors}
                              field={["firstName", "lastName", "fullName"]}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              id="email"
                              label={translate.email}
                              type="email"
                              name="email"
                              variant="standard"
                              fullWidth
                              required
                              defaultValue={values.email}
                              value={values.email}
                              onChange={(e) =>
                                setFieldValue("email", e.target.value)
                              }
                              InputLabelProps={{ required: true }}
                            />
                            <LcFormHelperText errors={errors} field="email" />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              id="phone"
                              label={translate.phone}
                              type="tel"
                              name="phone"
                              variant="standard"
                              fullWidth
                              required
                              defaultValue={values.phone}
                              value={values.phone}
                              onChange={(e) =>
                                setFieldValue("phone", e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (values.phone?.length > 1 && e.key === "+") {
                                  e.preventDefault();
                                }
                                if (["-", "e", "E"].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              InputLabelProps={{ required: true }}
                            />
                            <LcFormHelperText errors={errors} field="phone" />
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider />
                      <Box mt={3}>
                        <Typography
                          variant="subtitle1"
                          color="primary.main"
                          textTransform="uppercase"
                        >
                          {translate.addressInfo}
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item sm={6} xs={12}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "100%" }}
                            >
                              <InputLabel id="province-label" required>
                                {translate.province}
                              </InputLabel>
                              <Select
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
                              <LcFormHelperText
                                errors={errors}
                                field="provinceId"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "100%" }}
                            >
                              <InputLabel id="district-label" required>
                                {translate.district}
                              </InputLabel>
                              <Select
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
                              <LcFormHelperText
                                errors={errors}
                                field="districtId"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "100%" }}
                            >
                              <InputLabel id="ward-label" required>
                                {translate.ward}
                              </InputLabel>
                              <Select
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
                              <LcFormHelperText
                                errors={errors}
                                field="wardId"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              label={translate.address}
                              variant="standard"
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
                              InputLabelProps={{ required: true }}
                            />
                            <LcFormHelperText
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
                    <LcLoadingButton
                      isLoading={isSubmitting}
                      variant="contained"
                      size="small"
                      type="submit"
                      fullWidth
                      sx={{ maxWidth: 300 }}
                    >
                      {translate.confirm}
                    </LcLoadingButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Dialog>
      <LcAlert
        title={translate.somethingWentWrong}
        open={isFailure}
        onClose={() => setIsFailure(false)}
      >
        {translate.createFailure}
      </LcAlert>
    </>
  );
};
