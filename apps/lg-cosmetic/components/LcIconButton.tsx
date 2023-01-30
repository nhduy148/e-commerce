import {
  CircularProgress,
  Icon,
  IconButton,
  IconButtonProps,
  lighten,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";

interface ILcIconButtonProps extends IconButtonProps {
  active?: boolean;
  iconName?: string;
  isLoading?: boolean;
  children?: JSX.Element;
  classes?: string | string[];
}

const LcIconButtonComponent = (props: ILcIconButtonProps) => {
  const { active, iconName, children, isLoading, classes, ...remainProps } =
    props;
  const theme = useTheme();
  const generateClasses = () => {
    let result = ["lc-icon-button"];
    if (active) {
      result.push("Mui-active");
    }
    if (Array.isArray(classes)) {
      result = [...result, ...classes];
    }
    if (typeof classes === "string") {
      result.push(classes);
    }

    return result.filter(Boolean).join(" ");
  };
  return (
    <IconButton
      className={generateClasses()}
      {...remainProps}
      sx={{ position: "relative", ...remainProps?.sx }}
      disabled={isLoading || remainProps?.disabled}
    >
      {iconName ? <Icon fontSize="inherit">{iconName}</Icon> : children}
      {isLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            color: lighten(theme.palette.primary.main, 0.6),
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            width: "auto !important",
            height: "auto !important",
            zIndex: 1,
          }}
        />
      )}
    </IconButton>
  );
};

export const LcIconButton = memo(LcIconButtonComponent, isEqual);
