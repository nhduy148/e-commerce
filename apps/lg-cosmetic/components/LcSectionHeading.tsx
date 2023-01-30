import { FC } from "react";

import { useBreakPoint } from "@lc/hooks";
import { Box, Typography, TypographyProps } from "@mui/material";

interface ISectionHeadingProps extends TypographyProps {
  text: string;
}

export const LcSectionHeading: FC<ISectionHeadingProps> = ({
  text,
  ...props
}) => {
  const isPC = useBreakPoint("sm");
  return (
    text?.length > 0 && (
      <Box
        sx={{
          position: "relative",
          paddingTop: isPC ? 2 : 1,
          "::before": {
            content: "''",
            position: "absolute",
            left: "50%",
            top: 0,
            width: isPC ? 80 : 60,
            height: "2px",
            backgroundColor: "primary.main",
            transform: "translateX(-50%)",
          },
        }}
      >
        <Typography
          color="primary"
          textAlign="center"
          textTransform="uppercase"
          variant="h5"
          {...props}
        >
          {text}
        </Typography>
      </Box>
    )
  );
};
