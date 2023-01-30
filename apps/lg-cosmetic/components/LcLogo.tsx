import { Logo, LogoWhite } from "@lc/static/images";
import { Box, BoxProps } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

interface ILcLogoProps {
  color: "gray" | "white";
  clickable?: boolean;
  onClick?: (event: any) => void;
  width?: number;
  height?: number;
  BoxProps?: BoxProps;
}

const LcLogo = ({
  color,
  clickable,
  BoxProps,
  width,
  height,
  ...props
}: ILcLogoProps) => {
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
      <Image
        width={width}
        height={height}
        alt={siteName}
        src={color === "white" ? LogoWhite : Logo}
        priority
      />
    </Box>
  );
};

LcLogo.defaultProps = {
  color: "white",
  clickable: false,
};

export { LcLogo };
