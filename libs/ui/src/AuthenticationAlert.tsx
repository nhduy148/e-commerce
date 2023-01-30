import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import * as React from "react";

interface Props {
  alertText: string;
  alertType: AlertColor;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function AuthenticationAlert({ alertText, alertType }: Props) {
  return (
    <Alert severity={alertType} sx={{ width: "100%" }}>
      {alertText}
    </Alert>
  );
}
