import { Box, keyframes, Modal } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";

interface Props {
  children: JSX.Element;
  isOpen?: boolean;
  onClose: () => void;
  onOpen: () => void;
}
const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to { opacity: 1;}
`;

const LcAuthenModalComponent = ({
  onClose,
  onOpen,
  isOpen,
  children,
}: Props) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableScrollLock
      sx={{
        animation: `${fadeIn} ease-in  .5s`,
      }}
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        bgcolor="background.default"
        sx={{
          transform: "translate(-50%,-50%)",
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Box display="flex">{children}</Box>
      </Box>
    </Modal>
  );
};

export const LcAuthenModal = memo(LcAuthenModalComponent, isEqual);
