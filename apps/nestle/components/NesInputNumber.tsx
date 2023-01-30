import { Input, InputProps } from "@mui/material";
import { isNaN } from "lodash-es";
import { forwardRef, useImperativeHandle } from "react";

interface IProps extends Omit<InputProps, "onChange" | "onKeyUp" | "ref"> {
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export const NesInputNumber = forwardRef<any, IProps>(
  ({ min, max, ...props }, ref) => {
    useImperativeHandle(ref, () => ({
      handleChange,
    }));

    const handleChange = (value: number) => {
      // @ts-ignore
      const intValue = parseInt(value, 10);
      if (!isNaN(min) && intValue < min) return;

      if (!isNaN(max) && intValue > max) return;

      props?.onChange && props?.onChange(intValue);
    };

    return (
      <Input
        {...props}
        onChange={(e) => handleChange(Number(e.target.value))}
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        sx={{
          input: {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          },
          ...props?.sx,
        }}
        inputProps={{
          ...props?.inputProps,
          style: {
            textAlign: "center",
            ...props?.inputProps?.style,
          },
        }}
      />
    );
  },
);
