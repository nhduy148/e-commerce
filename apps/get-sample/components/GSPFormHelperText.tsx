import { FormHelperText } from "@mui/material";
import { FormikErrors } from "formik";
import { get } from "lodash-es";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

interface IProps {
  errors: FormikErrors<any>;
  field: string;
}

export const GSPFormHelperText: FC<IProps> = ({ errors, field }) => {
  const error = get(errors, field, null);
  return (
    error && (
      <FormHelperText error>
        <FormattedMessage id={error || error?.[0]} />
      </FormHelperText>
    )
  );
};
