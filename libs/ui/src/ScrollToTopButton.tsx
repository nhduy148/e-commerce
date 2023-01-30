import { ArrowUpward as ArrowUpwardIcon } from "@mui/icons-material";
import { Box, Fab, useScrollTrigger, useTheme, Zoom } from "@mui/material";

interface IProps {
  window?: () => Window;
  customPosition?: {
    top?: number | "unset";
    left?: number | "unset";
    right?: number | "unset";
    bottom?: number | "unset";
  };
}

export const ScrollToTopButton = (props: IProps) => {
  const trigger = useScrollTrigger({
    // @ts-ignore
    target: props?.window ? props?.window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const { palette } = useTheme();

  return (
    <Zoom in={trigger}>
      <Box
        display="inline-block"
        position="fixed"
        right={{ xs: 16, sm: 90 }}
        bottom={{ xs: 72, sm: 16 }}
        {...props?.customPosition}
      >
        <Box color="grey.200">
          <Fab
            sx={{
              boxShadow: `0px 3px 32px ${palette.action.focus}`,
              backgroundColor: palette.common.white,
              color: palette.primary.main,
              border: "1px solid",
              ":hover": {
                color: palette.common.white,
                backgroundColor: palette.primary.main,
              },
              ":focus": {
                boxShadow: `0px 3px 32px ${palette.action.focus}`,
                backgroundColor: palette.common.white,
                color: palette.primary.main,
                border: "1px solid",
              },
              width: { xs: 30, sm: 40 },
              minWidth: { xs: 30, sm: 40 },
              height: { xs: 30, sm: 40 },
              minHeight: { xs: 30, sm: 40 },
            }}
            onClick={() => {
              scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }}
            size="small"
          >
            <ArrowUpwardIcon />
          </Fab>
        </Box>
      </Box>
    </Zoom>
  );
};
