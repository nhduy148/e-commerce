import {
  LcAuthenModal,
  LcForgotPassModal,
  LcLoginModal,
  LcRegisterModal,
} from "@lc/components";
import { ImageForgotPass, ImageLogin, ImageRegister } from "@lc/static/images";
import { AuthenticationModal, SwitchModalObject } from "@lc/types";
import { memo } from "react";
import isEqual from "react-fast-compare";

interface Props {
  onOpen?: () => void;
  onClose?: () => void;
  onBackToLogin?: () => void;
  onGoToRegister?: (e: Event) => void;
  onGoToForgotPassword?: (e: Event) => void;
  isOpen: boolean;
  modal?: AuthenticationModal;
}

const LcAuthenControlModalComponent = ({
  onOpen,
  onClose,
  onBackToLogin,
  onGoToRegister,
  onGoToForgotPassword,
  isOpen,
  modal,
}: Props) => {
  const switchModal: SwitchModalObject = {
    login: (
      <LcLoginModal
        img={ImageLogin}
        onClose={onClose}
        onGoToRegister={onGoToRegister}
        onGoToForgotPassword={onGoToForgotPassword}
      />
    ),
    register: (
      <LcRegisterModal
        img={ImageRegister}
        onClose={onClose}
        onBackToLogin={onBackToLogin}
      />
    ),
    forgotPassword: (
      <LcForgotPassModal
        img={ImageForgotPass}
        onClose={onClose}
        onBackToLogin={onBackToLogin}
      />
    ),
  };

  return (
    <LcAuthenModal isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      {switchModal[modal]}
    </LcAuthenModal>
  );
};

export const LcAuthenControlModal = memo(
  LcAuthenControlModalComponent,
  isEqual,
);
