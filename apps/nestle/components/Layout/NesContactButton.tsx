import { useFormatter } from "@hera/i18n";
import { Box, Button, Typography } from "@mui/material";
import { CONTACT_INFORMATION } from "@nestle/constants";
import { FC } from "react";

interface IProps {
  size?: "small" | "medium";
}

const NesContactButton: FC<IProps> = ({ size }) => {
  const { __ } = useFormatter();
  return (
    <Box flex="1 1 160px" minWidth={160} display="flex">
      <Button
        size="small"
        variant="text"
        sx={{ flexDirection: "column", m: "auto", px: 0.75, py: 1 }}
        component="a"
        href={`tel:${CONTACT_INFORMATION.phoneNumber}`}
      >
        <Typography
          sx={{ mb: size === "small" ? 0 : 0.5, textAlign: "center" }}
          color="text.primary"
          variant={size === "small" ? "overline" : "body2"}
        >
          {__({ defaultMessage: "CSKH (8h00 - 23h00)" })}
        </Typography>
        <Typography
          variant={size === "small" ? "subtitle2" : "subtitle1"}
          color="secondary"
        >
          {CONTACT_INFORMATION.phoneNumber}
        </Typography>
      </Button>
    </Box>
  );
};

NesContactButton.defaultProps = {
  size: "medium",
};

export { NesContactButton };
