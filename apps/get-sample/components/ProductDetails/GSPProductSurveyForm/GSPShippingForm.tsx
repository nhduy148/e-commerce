import { GSPFormHelperText } from "@gsp/components";
import { splitFullName } from "@gsp/utils";
import { IFormDynamicContent, useGetLocation } from "@hera/data";
import { useFormatter } from "@hera/i18n";
import {
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import Select from "@mui/material/Select";
import { FormikProps } from "formik";
import { FC, useEffect, useMemo, useState } from "react";

const initSelectedLocationIds = {
  provinceId: null,
  districtId: null,
  wardId: null,
};

export const GSPShippingForm: FC<
  FormikProps<IFormDynamicContent> & { formSectionLength: number }
> = ({ setFieldValue, values, errors, formSectionLength }) => {
  const theme = useTheme();
  const { __ } = useFormatter();
  const [selectedLocationIds, setSelectedLocationIds] = useState(
    initSelectedLocationIds,
  );
  const isGetAllLocationData = useMemo(
    () =>
      !!selectedLocationIds.provinceId &&
      !!selectedLocationIds.districtId &&
      !!selectedLocationIds.wardId,
    [selectedLocationIds],
  );
  const { data: addressData, isLoading: isLocationLoading } = useGetLocation(
    selectedLocationIds,
    isGetAllLocationData,
  );
  const { customerInfo } = values;

  useEffect(() => {
    if (!customerInfo.provinceId) {
      setSelectedLocationIds(initSelectedLocationIds);
    }
  }, [customerInfo.provinceId]);

  return (
    <>
      <Grid item xs={12}>
        <FormLabel required>
          {`${formSectionLength + 1}. ${__({
            defaultMessage:
              "Vui lòng xác nhận địa chỉ chính xác để quá trình vận chuyển Sản Phẩm thông suốt",
          })}`}
        </FormLabel>
      </Grid>
      <Grid item xs={12}>
        <TextField
          InputLabelProps={{
            required: true,
          }}
          size="small"
          id="displayName"
          label={__({ defaultMessage: "Họ tên" })}
          defaultValue={customerInfo.displayName}
          value={customerInfo.displayName}
          name="displayName"
          type="text"
          variant="outlined"
          fullWidth
          onChange={(e) => {
            const fullName = e.target.value.trimLeft();
            setFieldValue("customerInfo.displayName", fullName);
            const { firstName, lastName } = splitFullName(fullName);

            setFieldValue("customerInfo.firstName", firstName);
            setFieldValue("customerInfo.lastName", lastName);
          }}
        />
        <GSPFormHelperText errors={errors} field="customerInfo.displayName" />
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextField
          InputLabelProps={{
            required: true,
          }}
          size="small"
          id="phone"
          label={__({ defaultMessage: "Số điện thoại" })}
          type="tel"
          name="phone"
          variant="outlined"
          fullWidth
          defaultValue={customerInfo.phone}
          value={customerInfo.phone}
          onChange={(e) => setFieldValue("customerInfo.phone", e.target.value)}
        />
        <GSPFormHelperText errors={errors} field="customerInfo.phone" />
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextField
          InputLabelProps={{
            required: true,
          }}
          size="small"
          variant="outlined"
          id="email"
          label={__({ defaultMessage: "Email" })}
          // type="email"
          name="email"
          fullWidth
          defaultValue={customerInfo.email}
          value={customerInfo.email}
          onChange={(e) => setFieldValue("customerInfo.email", e.target.value)}
        />
        <GSPFormHelperText errors={errors} field="customerInfo.email" />
      </Grid>
      <Grid item sm={6} xs={12}>
        <FormControl variant="outlined" sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              top: "-6px",
            }}
            id="province-label"
            required
          >
            {__({ defaultMessage: "Tỉnh/Thành phố" })}
          </InputLabel>
          <Select
            size="small"
            disabled={isLocationLoading}
            labelId="province-label"
            id="province"
            name="province"
            defaultValue={customerInfo.provinceId}
            value={customerInfo.provinceId}
            onChange={(e) => {
              const provinceId = e.target.value;
              setFieldValue("customerInfo.provinceId", provinceId);
              setFieldValue("customerInfo.districtId", "");
              setFieldValue("customerInfo.wardId", "");
              setSelectedLocationIds({
                provinceId,
                districtId: null,
                wardId: null,
              });
            }}
            label={__({ defaultMessage: "Tỉnh/Thành phố" })}
          >
            {addressData?.provinces?.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
          <GSPFormHelperText errors={errors} field="customerInfo.provinceId" />
        </FormControl>
      </Grid>
      <Grid item sm={6} xs={12}>
        <FormControl variant="outlined" sx={{ width: "100%" }}>
          <InputLabel
            id="district-label"
            sx={{
              top: "-6px",
            }}
            required
          >
            {__({ defaultMessage: "Quận/Huyện" })}
          </InputLabel>
          <Select
            size="small"
            disabled={isLocationLoading}
            labelId="district-label"
            id="district"
            defaultValue={customerInfo.districtId}
            value={customerInfo.districtId}
            onChange={(e) => {
              const districtId = e.target.value;
              setFieldValue("customerInfo.districtId", districtId);
              setFieldValue("customerInfo.wardId", "");
              setSelectedLocationIds((ids) => ({
                ...ids,
                districtId,
                wardId: null,
              }));
            }}
            label={__({ defaultMessage: "Quận/Huyện" })}
          >
            {addressData?.districts?.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
          <GSPFormHelperText errors={errors} field="customerInfo.districtId" />
        </FormControl>
      </Grid>
      <Grid item sm={6} xs={12}>
        <FormControl variant="outlined" sx={{ width: "100%" }}>
          <InputLabel
            sx={{
              top: "-6px",
            }}
            id="ward-label"
            required
          >
            {__({ defaultMessage: "Phường/Xã" })}
          </InputLabel>
          <Select
            size="small"
            disabled={isLocationLoading}
            labelId="ward-label"
            id="ward"
            defaultValue={customerInfo.wardId}
            value={customerInfo.wardId}
            onChange={(e) => {
              const wardId = e.target.value;
              setFieldValue("customerInfo.wardId", wardId);
              setSelectedLocationIds((ids) => ({
                ...ids,
                wardId,
              }));
            }}
            label={__({ defaultMessage: "Phường/Xã" })}
          >
            {addressData?.wards?.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
          <GSPFormHelperText errors={errors} field="customerInfo.wardId" />
        </FormControl>
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextField
          InputLabelProps={{
            required: true,
            sx: {
              color: theme.palette.text.secondary,
            },
          }}
          size="small"
          label={__({ defaultMessage: "Địa chỉ" })}
          variant="outlined"
          fullWidth
          id="address"
          name="address"
          defaultValue={customerInfo.address}
          value={customerInfo.address}
          onChange={(e) =>
            setFieldValue("customerInfo.address", e.target.value.trimLeft())
          }
        />
        <GSPFormHelperText errors={errors} field="customerInfo.address" />
      </Grid>
    </>
  );
};
