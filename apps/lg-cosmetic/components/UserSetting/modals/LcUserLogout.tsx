import { AuthenticationContext } from "@hera/contexts";
import { useLogout } from "@hera/data";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

interface IUserLogoutProps {
  open: boolean;
  closeModal: () => void;
}

export const UserLogout = styled(Dialog)`
  .MuiDialogTitle-root {
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
    padding: 24px;
  }

  .MuiDialog-paper {
    border-top: 4px solid ${({ theme }) => theme.palette.primary.main};
  }

  .MuiDialogContent-root {
    padding-top: 24px !important;
    padding: 24px;
  }

  .MuiDialogActions-root {
    padding: 0 24px 24px 24px;
    display: flex;
    justify-content: space-between;
  }

  .MuiButton-root {
    width: 100%;
  }
`;

export const LcUserLogout: React.FunctionComponent<IUserLogoutProps> = ({
  open,
  closeModal,
}) => {
  const { onLogout } = useContext(AuthenticationContext);
  const { mutate } = useLogout();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleLogout = () => {
    mutate(null, {
      onSuccess() {
        enqueueSnackbar(formatMessage({ id: "authentication.logoutSuccess" }), {
          variant: "success",
        });
        onLogout(() => {
          setTimeout(() => {
            location.href = "/";
          }, 1000);
        });
      },
    });
  };

  const pageContent = {
    logout: formatMessage({ id: "userSetting.logout" }),
    logoutConfirm: formatMessage({ id: "userSetting.logoutConfirm" }),
    closeModal: formatMessage({ id: "userSetting.closeModal" }),
  };

  return (
    <UserLogout open={open} onClose={closeModal}>
      <DialogTitle>
        <Typography variant="h6" textTransform="uppercase">
          {pageContent.logout}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">{pageContent.logoutConfirm}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          variant="contained"
          onClick={() => closeModal()}
          size="small"
        >
          {pageContent.closeModal}
        </Button>
        <Button variant="contained" size="small" onClick={handleLogout}>
          {pageContent.logout}
        </Button>
      </DialogActions>
    </UserLogout>
  );
};
