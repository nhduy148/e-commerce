import { Box, LinearProgress } from "@mui/material";
import { LcLogo } from "../LcLogo";

interface IProps {
  isLoading?: boolean;
  progress?: number;
}

export const LcAppLoading = ({ isLoading, progress }: IProps) => {
  return (
    <Box
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        visibility: isLoading ? "visible" : "hidden",
        opacity: isLoading ? 1 : 0,
        zIndex: isLoading ? 9999 : -9999,
      }}
    >
      <Box
        width={1}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box p={1.25}>
        <LcLogo color="gray" />
      </Box>
    </Box>
  );
};
