import { FormHelperText } from "@mui/material";
import { FormikErrors } from "formik";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
  errors: FormikErrors<any>;
  field: string | string[];
}

export const NesFormHelperText: FC<IProps> = ({ errors, field }) => {
  let fieldKey;
  if (Array.isArray(field)) {
    fieldKey = field.find((key) => Boolean(errors?.[key]));
  } else {
    fieldKey = field;
  }

  return (
    Boolean(errors?.[fieldKey]) && (
      <FormHelperText error>
        <FormattedMessage id={errors?.[fieldKey] || errors?.[fieldKey]?.[0]} />
      </FormHelperText>
    )
  );
};
