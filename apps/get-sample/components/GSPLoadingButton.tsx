import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React, { FC } from "react";

interface IProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const GSPLoadingButton: FC<IProps> = ({
  isLoading,
  children,
  ...buttonProps
}) => {
  let circularProgressSize = 20;
  if (buttonProps?.size === "large") {
    circularProgressSize = 21;
  } else if (buttonProps?.size === "medium") {
    circularProgressSize = 18;
  } else {
    circularProgressSize = 15;
  }

  let circularProgressColor = "primary.main";
  if (buttonProps?.variant === "contained") {
    if (
      buttonProps?.color === undefined ||
      buttonProps?.color === "primary" ||
      buttonProps?.color === "inherit"
    ) {
      circularProgressColor = "white";
    }
  }

  const defaultEvent = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Button
      {...buttonProps}
      startIcon={
        isLoading ? (
          <CircularProgress
            size={circularProgressSize}
            sx={{ color: circularProgressColor }}
          />
        ) : (
          buttonProps?.startIcon
        )
      }
      onClick={isLoading ? defaultEvent : buttonProps?.onClick}
      disabled={isLoading || buttonProps.disabled}
    >
      {children}
    </Button>
  );
};
