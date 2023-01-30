import {
  IShippingInfo,
  IShippingInfoPayload,
  useCreateShippingInfo,
  useDeleteShippingAddress,
  useGetLocation,
  useGetShippingInfo,
  useUpdateShippingInfo,
} from "@hera/data";
import { convertPhoneNumber, isSpecialCharacterRegex } from "@hera/utils";
import {
  LcConfirmationDialog,
  LcFormHelperText,
  LcLoadingButton,
} from "@lc/components";
import { gtmEvent } from "@lc/libs";
import { splitFullname } from "@lc/utils";
import {
  shippingInfoInitialValues,
  shippingInfoValidations,
} from "@lc/validations";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogProps,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Form, Formik, FormikHelpers } from "formik";
import { isEqual } from "lodash-es";
import { useSnackbar } from "notistack";
import { FC, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

interface IProps extends Omit<DialogProps, "children"> {
  shippingInfo?: IShippingInfo;
  onSuccess?: (result?: IShippingInfo) => void;
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

export const LcShippingAddressModal: FC<IProps> = ({
  onClose,
  onSuccess,
  shippingInfo,
  ...props
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { refetch: refetchShippingAddress } = useGetShippingInfo(true);
  const { mutateAsync: createShippingInfoAsync } = useCreateShippingInfo();
  const { mutateAsync: updateShippingInfoAsync } = useUpdateShippingInfo();
  const { mutate } = useDeleteShippingAddress();
  const [isDeleting, setIsDeleting] = useState(false);
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
  const isEditable =
    shippingInfo && Object.values(shippingInfo).filter(Boolean).length > 0;

  useEffect(() => {
    if (shippingInfo && isEditable && props.open === true) {
      const provinceId = shippingInfo.province?.id || null;
      const districtId = shippingInfo.district?.id || null;
      const wardId = shippingInfo.ward?.id || null;
      setSelectedIds({
        provinceId,
        districtId,
        wardId,
      });
    }
  }, [shippingInfo, props.open]);

  const shippingInfoPayload: IShippingInfoPayload = useMemo(() => {
    if (shippingInfo && isEditable) {
      const provinceId = shippingInfo.province?.id || null;
      const districtId = shippingInfo.district?.id || null;
      const wardId = shippingInfo.ward?.id || null;
      const fullName = [shippingInfo.firstName, shippingInfo.lastName]
        .filter(Boolean)
        .join(" ");
      return {
        id: shippingInfo?.id || null,
        addressLine: shippingInfo.addressLine,
        provinceId,
        districtId,
        wardId,
        fullName,
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        phone: shippingInfo.phone,
        isDefault: shippingInfo.isDefault,
        displayName: shippingInfo.displayName,
      };
    }
    return { fullName: "", ...shippingInfoInitialValues };
  }, [shippingInfo, isEditable]);

  const translate = {
    titleEdit: formatMessage({ id: "modals.shippingInfo.titleEdit" }),
    titleCreate: formatMessage({ id: "modals.shippingInfo.titleCreate" }),
    buyerInfo: formatMessage({ id: "modals.shippingInfo.clientInfo" }),
    addressInfo: formatMessage({ id: "modals.shippingInfo.addressInfo" }),
    setAsDefault: formatMessage({ id: "modals.shippingInfo.setAsDefault" }),
    fullName: formatMessage({ id: "common.fullName" }),
    phone: formatMessage({ id: "common.phone" }),
    province: formatMessage({ id: "common.province" }),
    district: formatMessage({ id: "common.district" }),
    address: formatMessage({ id: "common.address" }),
    ward: formatMessage({ id: "common.ward" }),
    cancel: formatMessage({ id: "common.cancel" }),
    edit: formatMessage({ id: "common.edit" }),
    createNew: formatMessage({ id: "common.createNew" }),
    createFailure: formatMessage({
      id: "modals.shippingInfo.createFailure",
    }),
    createSuccess: formatMessage({
      id: "modals.shippingInfo.createSuccess",
    }),
    updateFailure: formatMessage({
      id: "modals.shippingInfo.updateFailure",
    }),
    updateSuccess: formatMessage({
      id: "modals.shippingInfo.updateSuccess",
    }),
    invalidFullName: formatMessage({
      id: "validations.common.invalidFullName",
    }),
    donotContainSpecialCharacters: formatMessage({
      id: "validations.common.donotContainSpecialCharacters",
    }),
    deleteShippingAddress: formatMessage({
      id: "modals.shippingInfo.deleteShippingAddress",
    }),
    deleteSuccess: formatMessage({ id: "modals.shippingInfo.deleteSuccess" }),
    deleteFailure: formatMessage({ id: "modals.shippingInfo.deleteFailure" }),
    deleteConfirm: formatMessage({ id: "modals.shippingInfo.deleteConfirm" }),
    confirm: formatMessage({ id: "common.confirm" }),
  };

  const handleSubmit = async (
    values: IShippingInfoPayload,
    actions: FormikHelpers<IShippingInfoPayload>,
  ) => {
    actions.setSubmitting(true);
    let data;
    const { phone } = values;
    values.phone = convertPhoneNumber(phone);
    if (isSpecialCharacterRegex.test(values.phone)) {
      actions.setFieldError("phone", "validations.common.invalidPhoneNumber");
      return;
    }
    try {
      gtmEvent("add_shipping_info", values);
      if (isEditable) {
        data = await updateShippingInfoAsync({
          id: shippingInfo.id,
          ...values,
        });
        enqueueSnackbar(translate.updateSuccess, {
          variant: "success",
        });
      } else {
        data = await createShippingInfoAsync(values);
        enqueueSnackbar(translate.createSuccess, {
          variant: "success",
        });
      }
      await refetchShippingAddress();
      onSuccess && onSuccess(data);
    } catch (error) {
      if (isEditable) {
        enqueueSnackbar(translate.updateFailure, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(translate.createFailure, {
          variant: "error",
        });
      }
    } finally {
      actions.setSubmitting(true);
      actions.resetForm({
        values: shippingInfoInitialValues,
      });
    }
  };

  const handleRemoveShippingAddress = () => {
    if (!shippingInfo.id) {
      throw new Error("ShippingAddress Id is not defined");
    }
    if (shippingInfo?.isDefault) {
      return;
    }
    setIsDeleting(true);
    mutate(
      { id: shippingInfo.id },
      {
        onSuccess: () => {
          enqueueSnackbar(translate.deleteSuccess, {
            variant: "success",
          });
          refetchShippingAddress();
          setIsDeleting(false);

          onClose && onClose({}, "escapeKeyDown");
        },
        onError: () => {
          enqueueSnackbar(translate.deleteFailure, {
            variant: "error",
          });
        },
      },
    );
  };

  const handleReset = (_, actions: FormikHelpers<IShippingInfoPayload>) => {
    setSelectedIds(initSelectedIds);
    onClose && onClose({}, "escapeKeyDown");
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
          <Box pt={2.5} pb={2} px={2}>
            <Typography variant="h5" textTransform="uppercase">
              {isEditable ? translate.titleEdit : translate.titleCreate}
            </Typography>
          </Box>
          <Divider />
          <Formik
            initialValues={shippingInfoPayload}
            validationSchema={shippingInfoValidations}
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
                initialValues,
                values,
                errors,
                isSubmitting,
              } = props;
              const isValueChanged = !isEqual(values, initialValues);
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
                          <Grid item sm={6} xs={12}>
                            <TextField
                              id="fullName"
                              label={translate.fullName}
                              defaultValue={values.fullName}
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
                                  setFieldValue("districtId", "");
                                  setFieldValue("wardId", "");
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
                                  setFieldValue("wardId", "");
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
                              id="addressLine"
                              name="addressLine"
                              defaultValue={values.addressLine}
                              value={values.addressLine}
                              onChange={(e) =>
                                setFieldValue(
                                  "addressLine",
                                  e.target.value.trimLeft(),
                                )
                              }
                              required
                              InputLabelProps={{ required: true }}
                            />
                            <LcFormHelperText
                              errors={errors}
                              field="addressLine"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </FormBox>
                    <FormGroup>
                      <FormControlLabel
                        sx={{ mt: 4 }}
                        control={
                          <Checkbox
                            checked={values.isDefault}
                            onChange={(e) => {
                              setFieldValue("isDefault", e.target.checked);
                            }}
                            value={values.isDefault}
                            size="small"
                            disabled={shippingInfo?.isDefault}
                          />
                        }
                        label={
                          <Typography>{translate.setAsDefault}</Typography>
                        }
                      />
                    </FormGroup>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                    p={2}
                  >
                    {isEditable && !shippingInfo?.isDefault && (
                      <LcLoadingButton
                        isLoading={isDeleting}
                        variant="outlined"
                        color="inherit"
                        size="small"
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        sx={{ mr: "auto" }}
                      >
                        {translate.deleteShippingAddress}
                      </LcLoadingButton>
                    )}
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Button
                        color="inherit"
                        variant="contained"
                        type="reset"
                        onClick={(e) => {
                          onClose && onClose(e, "backdropClick");
                        }}
                        size="small"
                      >
                        {translate.cancel}
                      </Button>
                      {isEditable ? (
                        <LcLoadingButton
                          isLoading={isSubmitting}
                          variant="contained"
                          size="small"
                          type="submit"
                          disabled={!isValueChanged}
                        >
                          {translate.edit}
                        </LcLoadingButton>
                      ) : (
                        <LcLoadingButton
                          isLoading={isSubmitting}
                          variant="contained"
                          size="small"
                          type="submit"
                        >
                          {translate.createNew}
                        </LcLoadingButton>
                      )}
                    </Stack>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
        <LcConfirmationDialog
          onlyConfirmation={false}
          confirmText={translate.confirm}
          description={translate.deleteConfirm}
          title={translate.deleteShippingAddress}
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          cancelText={translate.cancel}
          onConfirmClick={() => {
            setIsDeleteModalOpen(false);
            handleRemoveShippingAddress();
          }}
          onCancelClick={() => setIsDeleteModalOpen(false)}
        />
      </Dialog>
    </>
  );
};
