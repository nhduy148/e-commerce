import {
  Visibility as EyeOpenIcon,
  VisibilityOff as EyeOffIcon,
} from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps, useTheme } from "@mui/material";
import { useState } from "react";

export function PasswordField(props: TextFieldProps) {
  const theme = useTheme();
  const [showPass, setShowPass] = useState(false);

  const handleShow = () => setShowPass(!showPass);
  return (
    <>
      <TextField
        variant="standard"
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
          },
        }}
        size="small"
        type={showPass ? "text" : "password"}
      />
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleShow}
        sx={{
          position: "absolute",
          top: "0",
          right: "0",
        }}
        tabIndex={-1}
      >
        {showPass ? <EyeOffIcon /> : <EyeOpenIcon />}
      </IconButton>
    </>
  );
}
