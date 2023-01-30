import { Box, keyframes, Modal } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";

interface Props {
  children: JSX.Element;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}
const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to { opacity: 1;}
`;

const NesAuthenModalComponent = ({
  onClose,
  onOpen,
  isOpen,
  children,
}: Props) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        animation: `${fadeIn} ease-in  .5s`,
        overflow: "auto",

        "@media (orientation: landscape) and (max-height: 650px)": {
          scrollSnapType: "y mandatory",
        },
      }}
    >
      <Box
        sx={{
          height: 1,
          p: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          outline: "none",
          "@media (orientation: landscape)": {
            alignItems: "flex-start",
          },
        }}
      >
        <Box
          sx={{
            "&:focus": {
              outline: "none",
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 1,
            "@media (orientation: landscape) and (max-height: 650px)": {
              height: "auto",
            },
          }}
        >
          <Box
            borderRadius="10px"
            bgcolor="background.default"
            overflow="hidden"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export const NesAuthenModal = memo(NesAuthenModalComponent, isEqual);
