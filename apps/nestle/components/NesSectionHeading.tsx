import { Typography, TypographyProps } from "@mui/material";
import { useBreakPoint } from "@nestle/hooks";

interface ISectionHeadingProps extends TypographyProps {
  text: string;
  disableSpacing?: boolean;
}

export const NesSectionHeading = ({
  text,
  disableSpacing,
  ...rest
}: ISectionHeadingProps) => {
  const isPC = useBreakPoint("sm");
  return (
    <Typography
      textAlign="center"
      mb={disableSpacing ? 0 : 3}
      {...rest}
      color="text.primary"
      variant={isPC ? "h4" : "h5"}
    >
      <b>{text}</b>
    </Typography>
  );
};
