import { Box, FormControl, styled } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";

interface IColorVariantProps {
  colors: string[];
}
const LabelComponent = styled("label")`
  display: inline-block;
  height: 24px;
  width: 24px;
  border-radius: 50%;
`;

const RadioComponent = styled("input")`
  display: none;
  &:checked + label {
    border-color: ${({ theme }) => theme.palette.common.black};
  }
`;
const RadioButtonComponent = ({ colors }: IColorVariantProps) => {
  const handleRadio = (color) => {};
  return (
    <FormControl>
      <Box display="flex" alignItems="center">
        {colors.map((color, index) => (
          <Box position="relative" key={index} display="flex">
            <RadioComponent
              type="radio"
              id={color}
              name="radioFruit"
              onChange={() => handleRadio(color)}
            />
            <LabelComponent
              htmlFor={color}
              sx={{
                border: "2px solid ",
                borderColor: `white`,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "block",
                  height: "16px",
                  width: "16px",
                  backgroundColor: `${color}`,
                  borderRadius: "50%",
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </FormControl>
  );
};

export const LcRadioButton = memo(RadioButtonComponent, isEqual);
