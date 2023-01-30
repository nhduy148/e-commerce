import {
  NesForgotPassModal,
  NesAuthenModal,
  NesLoginModal,
  NesRegisterModal,
} from "@nestle/components";
import {
  ImageForgotPass,
  ImageLogin,
  ImageRegister,
} from "@nestle/static/images";
import { AuthenticationModal, SwitchModalObject } from "@nestle/types";
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

const NesAuthenControlModalComponent = ({
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
      <NesLoginModal
        img={ImageLogin}
        onClose={onClose}
        onGoToRegister={onGoToRegister}
        onGoToForgotPassword={onGoToForgotPassword}
      />
    ),
    register: (
      <NesRegisterModal
        img={ImageRegister}
        onClose={onClose}
        onBackToLogin={onBackToLogin}
      />
    ),
    forgotPassword: (
      <NesForgotPassModal
        img={ImageForgotPass}
        onClose={onClose}
        onBackToLogin={onBackToLogin}
      />
    ),
  };

  return (
    <NesAuthenModal isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      {switchModal[modal]}
    </NesAuthenModal>
  );
};

export const NesAuthenControlModal = memo(
  NesAuthenControlModalComponent,
  isEqual,
);
