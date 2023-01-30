import { Box, Button, useTheme } from "@mui/material";
import { NesInputNumber } from "@nestle/components";
import { memo, useRef } from "react";
import isEqual from "react-fast-compare";

interface ISpinnerInputProps {
  value: number;
  onChange?: (value: number) => void;
  min: number;
  max: number;
  sx?: {};
}

const NesInputCountComponent = (props: ISpinnerInputProps) => {
  const theme = useTheme();
  const inputRef = useRef(null);
  return (
    <Box
      display="flex"
      height="48px"
      sx={{
        borderRadius: "6px",
        alignItems: "center",
        maxWidth: "90px",
        mr: 1,
        backgroundColor: theme.palette.common.white,
        ...props.sx,
      }}
    >
      <Button
        sx={{ minWidth: "30px", color: "inherit" }}
        variant="text"
        onClick={() => inputRef?.current?.handleChange(props.value - 1)}
      >
        -
      </Button>
      <NesInputNumber
        sx={{
          fontSize: theme.typography.subtitle2,
        }}
        ref={inputRef}
        type="number"
        disableUnderline
        value={Number(props.value)}
        min={props?.min}
        max={props?.max}
        onChange={props?.onChange}
      />
      <Button
        sx={{ minWidth: "30px", color: "inherit" }}
        variant="text"
        onClick={() => inputRef?.current?.handleChange(props.value + 1)}
      >
        +
      </Button>
    </Box>
  );
};

export const NesInputCount = memo(NesInputCountComponent, isEqual);
