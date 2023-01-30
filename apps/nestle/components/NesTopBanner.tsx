import { Box, Container } from "@mui/material";
import { ServerImage } from "@nestle/components";
import { forwardRef, memo } from "react";
import isEqual from "react-fast-compare";

interface ITopBannerProps {
  src: string;
}

const NesTopBannerComponent = forwardRef<HTMLDivElement, ITopBannerProps>(
  ({ src }, ref) => {
    if (src?.length <= 0 || !src) {
      return null;
    }

    return (
      <Box ref={ref}>
        <Container>
          <Box maxHeight={60} overflow="hidden">
            <Box position="relative" style={{ paddingTop: "5%" }}>
              <ServerImage src={src} layout="fill" />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  },
);

export const NesTopBanner = memo(NesTopBannerComponent, isEqual);
