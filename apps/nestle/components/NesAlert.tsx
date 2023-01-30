import {
  Box,
  Button,
  Divider,
  Modal,
  ModalProps,
  Paper,
  Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";

interface IProps extends Omit<ModalProps, "title" | "children"> {
  title: string | ReactNode;
  children: string | ReactNode | null;
  buttonText?: string;
}

export interface IAlertShape {
  open: boolean;
  description: string | ReactNode | null;
}

export const NesAlert: FC<IProps> = ({
  title,
  children,
  buttonText,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const buttonTextTranslate = formatMessage({ id: "common.confirm" });
  return (
    <Modal {...props}>
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={1}
      >
        <Paper
          elevation={1}
          sx={{ maxWidth: 600, minWidth: { xs: 260, sm: 400 } }}
        >
          <Box px={2} py={{ xs: 1, md: 2 }}>
            <Typography variant="body1">
              <b>{title}</b>
            </Typography>
          </Box>
          <Divider />
          <Box p={2}>{children}</Box>
          <Divider />
          <Box px={2} py={{ xs: 1, md: 2 }} textAlign="center">
            <Button
              variant="contained"
              size="small"
              onClick={(e) =>
                props?.onClose && props.onClose(e, "backdropClick")
              }
            >
              {buttonText || buttonTextTranslate}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};
