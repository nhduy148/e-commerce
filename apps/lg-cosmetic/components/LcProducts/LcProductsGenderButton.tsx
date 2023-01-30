import { Box, Button } from "@mui/material";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";

const LcProductsGenderButtonComponent = () => {
  const [gender, setGender] = useState("men");
  return (
    <Box mt={3}>
      <Button
        variant={gender === "men" ? "contained" : "text"}
        onClick={() => setGender("men")}
      >
        Nam
      </Button>
      <Button
        sx={{ ml: "16px" }}
        variant={gender === "women" ? "contained" : "text"}
        onClick={() => setGender("women")}
      >
        Nữ
      </Button>
    </Box>
  );
};

export const LcProductsGenderButton = memo(
  LcProductsGenderButtonComponent,
  isEqual,
);
