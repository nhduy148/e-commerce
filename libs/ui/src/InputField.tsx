import { TextField, TextFieldProps, useTheme } from "@mui/material";

export function InputField(props: TextFieldProps) {
  const theme = useTheme();
  return (
    <TextField
      size="small"
      {...props}
      sx={props.sx}
      InputLabelProps={{
        sx: {
          fontSize: theme.typography.body1.fontSize,
        },
      }}
      InputProps={{
        sx: {
          fontSize: theme.typography.body1.fontSize,
          backgroundColor: theme.palette.common.white,
        },
      }}
    />
  );
}
