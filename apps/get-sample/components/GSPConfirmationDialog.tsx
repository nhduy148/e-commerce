import { GSPLoadingButton } from "@gsp/components";
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

const GSPConfirmationDialog: FC<IProps> = ({
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
          <DialogTitle
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
            }}
          >
            {title}
          </DialogTitle>
          <Divider />
        </>
      )}
      {description && (
        <>
          <DialogContent
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
            }}
          >
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
        </>
      )}
      <DialogActions
        sx={{
          justifyContent: onlyConfirmation ? "center" : "flex-end",
          px: 2,
          pb: 2,
          pt: 1.5,
        }}
      >
        {!onlyConfirmation && (
          <Button
            disabled={isLoading}
            variant="outlined"
            size="large"
            fullWidth
            onClick={onCancelClick}
          >
            {cancelText}
          </Button>
        )}
        <GSPLoadingButton
          isLoading={isLoading}
          variant="contained"
          size="large"
          fullWidth
          onClick={onConfirmClick}
        >
          {confirmText}
        </GSPLoadingButton>
      </DialogActions>
    </Dialog>
  );
};

GSPConfirmationDialog.defaultProps = {
  cancelText: <FormattedMessage id="common.cancel" />,
  confirmText: <FormattedMessage id="common.confirm" />,
  onlyConfirmation: false,
  disableBackdropClick: true,
  isLoading: false,
};

export { GSPConfirmationDialog };
