import { Box, BoxProps } from "@mui/material";
import { NesStaticImage } from "@nestle/components";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

interface INesLogoProps {
  clickable?: boolean;
  onClick?: (event: any) => void;
  width?: number;
  height?: number;
  BoxProps?: BoxProps;
  full?: boolean;
}

const NesLogo = ({
  clickable,
  BoxProps,
  width,
  height,
  full,
  ...props
}: INesLogoProps) => {
  const { pathname, push } = useRouter();
  const { formatMessage } = useIntl();

  const siteName = formatMessage({ id: "common.siteName" });

  const onClick = (event: any) => {
    if (!clickable) {
      return;
    }
    if (typeof props?.onClick === "function") {
      props?.onClick(event);
      return;
    }
    if (pathname !== "/") {
      push("/");
    }
    if (window !== undefined) {
      window?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box
      {...BoxProps}
      sx={{
        position: "relative",
        cursor: clickable ? "pointer" : "default",
        fontSize: 0,
        lineHeight: 0,
        ...(BoxProps?.sx || {}),
      }}
      onClick={onClick}
    >
      <NesStaticImage
        alt={siteName}
        src={full ? "Logo" : "LogoMobile"}
        priority
      />
    </Box>
  );
};

NesLogo.defaultProps = {
  color: "white",
  clickable: false,
};

export { NesLogo };
