import useScrollTrigger from "@mui/material/useScrollTrigger";
import React from "react";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
  elevation?: number;
}

export function ElevationScroll(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? props.elevation || 4 : 0,
  });
}
