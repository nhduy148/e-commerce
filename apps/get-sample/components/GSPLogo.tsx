import { GSPStaticImage } from "@gsp/components";
import { Box, BoxProps } from "@mui/material";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

interface IGSPLogoProps {
  clickable?: boolean;
  onClick?: (event: any) => void;
  width?: number;
  height?: number;
  BoxProps?: BoxProps;
  isWhite?: boolean;
}

const GSPLogo = ({
  clickable,
  BoxProps,
  width,
  height,
  isWhite,
  ...props
}: IGSPLogoProps) => {
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
      <GSPStaticImage
        alt={siteName}
        src={isWhite ? "LogoWhite" : "Logo"}
        priority
        width={65}
        height={60}
      />
    </Box>
  );
};

GSPLogo.defaultProps = {
  color: "white",
  clickable: false,
};

export { GSPLogo };
