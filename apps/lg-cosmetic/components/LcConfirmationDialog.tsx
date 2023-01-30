import { LcLoadingButton } from "@lc/components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Divider,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface IProps extends DialogProps {
  title?: string;
  description?: string | JSX.Element | ReactNode;
  confirmText?: string | JSX.Element;
  onConfirmClick?: (event: any) => void;
  cancelText?: string | JSX.Element;
  onCancelClick?: (event: any) => void;
  onlyConfirmation?: boolean;
  disableBackdropClick?: boolean;
  isLoading?: boolean;
}

const LcConfirmationDialog: FC<IProps> = ({
  title,
  description,
  confirmText,
  onConfirmClick,
  cancelText,
  onCancelClick,
  onlyConfirmation,
  disableBackdropClick,
  isLoading,
  ...props
}) => {
  return (
    <Dialog
      disableEscapeKeyDown
      {...props}
      onClose={disableBackdropClick ? () => false : props?.onClose}
    >
      {title && (
        <>
          <DialogTitle>{title}</DialogTitle>
          <Divider />
        </>
      )}
      {description && (
        <>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
          <Divider />
        </>
      )}
      <DialogActions
        sx={{ justifyContent: onlyConfirmation ? "center" : "flex-end" }}
      >
        {!onlyConfirmation && (
          <Button
            disabled={isLoading}
            variant="outlined"
            size="small"
            onClick={onCancelClick}
          >
            {cancelText}
          </Button>
        )}
        <LcLoadingButton
          isLoading={isLoading}
          variant="contained"
          size="small"
          onClick={onConfirmClick}
        >
          {confirmText}
        </LcLoadingButton>
      </DialogActions>
    </Dialog>
  );
};

LcConfirmationDialog.defaultProps = {
  cancelText: <FormattedMessage id="common.cancel" />,
  confirmText: <FormattedMessage id="common.confirm" />,
  onlyConfirmation: false,
  disableBackdropClick: true,
  isLoading: false,
};

export { LcConfirmationDialog };
