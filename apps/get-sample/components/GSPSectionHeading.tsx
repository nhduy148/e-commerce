import { useBreakPoint } from "@gsp/hooks";
import {
  Box,
  SxProps,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { FC } from "react";

interface IProps extends TypographyProps {
  text: string;
  sx?: SxProps;
}

export const GSPSectionHeading: FC<IProps> = ({ text, ...props }) => {
  const isPC = useBreakPoint("sm");
  const theme = useTheme();

  return (
    <Box
      {...props}
      sx={{
        ...props?.sx,
        position: "relative",
        paddingBottom: 3,
        "::before": {
          content: '""',
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: 85,
          height: "4px",
          backgroundColor: theme.palette.secondary.main,
          transform: "translateX(-50%)",
        },
      }}
    >
      <Typography
        textAlign="center"
        color={theme.palette.text.primary}
        variant="h4"
      >
        <b>{text}</b>
      </Typography>
    </Box>
  );
};
