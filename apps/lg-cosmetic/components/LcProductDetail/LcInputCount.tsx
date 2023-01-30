import { LcInputNumber } from "@lc/components";
import { Box, Button } from "@mui/material";
import { memo, useRef } from "react";
import isEqual from "react-fast-compare";

interface ISpinnerInputProps {
  value: number;
  onChange?: (value: number) => void;
  min: number;
  max: number;
}

const LcInputCountComponent = (props: ISpinnerInputProps) => {
  const inputRef = useRef(null);
  return (
    <Box
      display="flex"
      width="98px"
      height="48px"
      sx={{
        border: " 2px solid ",
        borderColor: "grey.200",
        alignItems: "center",
      }}
    >
      <Button
        sx={{ minWidth: "30px", color: "inherit" }}
        variant="text"
        onClick={() => inputRef?.current?.handleChange(props.value - 1)}
      >
        -
      </Button>
      <LcInputNumber
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

export const LcInputCount = memo(LcInputCountComponent, isEqual);
