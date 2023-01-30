import { GSPFormHelperText } from "@gsp/components";
import {
  FormBuilderType,
  FormBuilderTypes,
  FormOption,
  IAnswer,
  IFormDynamicContent,
  IFormSection,
} from "@hera/data";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { FormikProps } from "formik";
import { isNil } from "lodash-es";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type IProps = FormikProps<IFormDynamicContent> & { fields: IFormSection[] };
export const GSPDynamicForm: FC<IProps> = ({
  setFieldValue,
  values,
  errors,
  fields,
}) => {
  const { customerAnswer } = values;
  const [selectedCheckbox, setSelectedCheckbox] = useState<{
    [key: string]: FormOption[];
  }>({});
  const [textfieldValues, setTextfieldValues] = useState<{
    [key: string]: Array<IAnswer & { id: string }>;
  }>({});

  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "textfield" && field?.options?.length > 0) {
        setTextfieldValues({
          [field.id]: (field.options || []).map((option) => ({
            id: option.id,
            question: option.value,
            answer: "",
          })),
        });
      }
    });
  }, []);

  const handleCheckboxChange = useCallback(
    (item: FormOption, checked: boolean, field: IFormSection) => {
      const currentField = selectedCheckbox?.[field.id] || [];
      const options = checked
        ? [...currentField, item]
        : currentField.filter((current) => current.id !== item.id);

      setSelectedCheckbox((prev) => ({ ...prev, [field.id]: options }));
      setFieldValue(
        `customerAnswer.${field.id}`,
        options.length > 0 ? JSON.stringify(options) : "",
      );
    },
    [selectedCheckbox, setSelectedCheckbox, setFieldValue],
  );

  const handleTextfieldChange = useCallback(
    (id, field: IFormSection, item?: FormOption) => {
      if (field?.options?.length > 0 && !isNil(item)) {
        const currentTextfieldValues = textfieldValues?.[field.id] || [];
        const index = currentTextfieldValues.findIndex(
          (curr) => curr.id === item.id,
        );
        if (index > -1) {
          currentTextfieldValues[index].answer = id;
          setTextfieldValues((prev) => ({
            ...prev,
            [field.id]: currentTextfieldValues,
          }));
          setFieldValue(
            `customerAnswer.${field.id}`,
            JSON.stringify(currentTextfieldValues),
          );
        }
      } else {
        setFieldValue(`customerAnswer.${field.id}`, id);
      }
    },
    [setFieldValue, setTextfieldValues, textfieldValues],
  );

  const handleRadioOrSelectChange = useCallback(
    (value, field: IFormSection) => {
      setFieldValue(`customerAnswer.${field.id}`, value);
    },
    [setFieldValue],
  );

  const renderField: {
    [type in FormBuilderType]: (
      field: IFormSection,
      index: number,
    ) => ReactNode;
  } = useMemo(() => {
    return {
      textfield: (field, index) => (
        <FormControl
          size="small"
          fullWidth
          required={Boolean(field.validations?.required)}
          className="MuiFormControlTextField-root"
        >
          <FormLabel required={Boolean(field.validations?.required)}>
            {`${index + 1}. ${field.label}`}
          </FormLabel>
          {(field.options?.length || -1) <= 0 ? (
            <OutlinedInput
              size="small"
              id={field.id}
              name={field.id}
              type="text"
              fullWidth
              onChange={(e) => handleTextfieldChange(e.target.value, field)}
              autoComplete="off"
            />
          ) : (
            (field.options || []).map((option) => (
              <TextField
                InputLabelProps={{
                  required: Boolean(field.validations?.required),
                }}
                className="MuiFormControlTextFieldItem-root"
                size="small"
                label={option?.value}
                id={option?.id}
                name={option.id}
                type="text"
                variant="outlined"
                fullWidth
                onChange={(e) =>
                  handleTextfieldChange(e.target.value, field, option)
                }
                autoComplete="off"
              />
            ))
          )}
        </FormControl>
      ),

      radio: (field, index) => (
        <FormControl
          size="small"
          fullWidth
          required={Boolean(field.validations?.required)}
        >
          <FormLabel required={Boolean(field.validations?.required)}>
            {`${index + 1}. ${field.label}`}
          </FormLabel>
          <RadioGroup
            id={field.id}
            name={field.id}
            value={customerAnswer?.[field.id]}
          >
            {(field.options || []).map((option, index) => (
              <FormControlLabel
                key={index}
                control={<Radio />}
                onChange={(e) => handleRadioOrSelectChange(option.value, field)}
                value={option?.id}
                label={option?.value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ),

      checkbox: (field, index) => (
        <FormControl
          size="small"
          fullWidth
          required={Boolean(field.validations?.required)}
        >
          <FormLabel required={Boolean(field.validations?.required)}>
            {`${index + 1}. ${field.label}`}
          </FormLabel>
          <FormGroup id={field.id}>
            {(field.options || []).map((option, index) => (
              <FormControlLabel
                key={index}
                id={option?.id}
                name={field.id}
                onChange={(_, checked) =>
                  handleCheckboxChange(option, checked, field)
                }
                control={<Checkbox />}
                value={option?.id}
                label={option?.value}
              />
            ))}
          </FormGroup>
        </FormControl>
      ),

      select: (field, index) => (
        <FormControl
          size="small"
          fullWidth
          required={Boolean(field.validations?.required)}
        >
          <FormLabel required={Boolean(field.validations?.required)}>
            {`${index + 1}. ${field.label}`}
          </FormLabel>
          <Select
            onChange={(e) => handleRadioOrSelectChange(e.target.value, field)}
            className="MuiSelect-root"
            id={field.id}
            name={field.id}
            value={customerAnswer?.[field.id]}
            label={`${index + 1}. ${field.label}`}
            required={Boolean(field.validations?.required)}
            MenuProps={{
              sx: {
                ".MuiMenuItem-root": {
                  width: 1,
                  wordBreak: "break-word",
                  whiteSpace: "unset",
                },
              },
            }}
          >
            {(field.options || []).map((option, index) => (
              <MenuItem key={option?.id || index} value={option?.id}>
                {option?.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    };
  }, [
    customerAnswer,
    handleCheckboxChange,
    handleTextfieldChange,
    handleRadioOrSelectChange,
  ]);

  const renderItem = useCallback(
    (field, index) => {
      if (!FormBuilderTypes.includes(field.type)) {
        return null;
      }

      return (
        <Grid item sm={12} xs={12} key={field.id}>
          {renderField[field.type]?.(field, index)}
          <GSPFormHelperText
            errors={errors}
            field={`customerAnswer.${field.id}`}
          />
        </Grid>
      );
    },
    [errors, renderField],
  );

  if (Array.isArray(fields) && fields.length > 0) {
    return <>{fields.map(renderItem)}</>;
  }

  return null;
};
