import { Box, Button } from "@mui/material";
import { memo, useState } from "react";
import isEqual from "react-fast-compare";
import { useIntl } from "react-intl";

const NesSizeButtonComponent = () => {
  const [size, setSize] = useState<string>("large");
  const { formatMessage } = useIntl();

  const pageContent = {
    smallBottle: formatMessage({ id: "productDetail.smallBottle" }),
    bigBottle: formatMessage({ id: "productDetail.bigBottle" }),
  };

  const handleChangeLarge = () => {
    setSize("large");
  };

  const handleChangeSizeSmall = () => {
    setSize("small");
  };

  return (
    <Box>
      <Button
        size="small"
        variant={size === "large" ? "outlined" : "text"}
        onClick={handleChangeLarge}
      >
        {pageContent.smallBottle}
      </Button>
      <Button
        size="small"
        variant={size === "small" ? "outlined" : "text"}
        sx={{ ml: 1 }}
        onClick={handleChangeSizeSmall}
      >
        {pageContent.bigBottle}
      </Button>
    </Box>
  );
};

export const NesSizeButton = memo(NesSizeButtonComponent, isEqual);
