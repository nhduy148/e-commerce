import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import {
  IChangePasswordPayload,
  IChangePasswordSuccess,
  IForgotPasswordPayload,
  IForgotPasswordSuccess,
  ILoginSuccess,
  IPasswordLoginPayload,
  IPasswordRegisterPayload,
  IRegisterSuccess,
  IResetPasswordPayload,
  IResetPasswordSuccess,
  ISocialLoginParams,
  IUpdateProfilePayload,
  IUpdateProfileSuccess,
  IVerifyPayload,
  IVerifySuccess,
  User,
} from "../models";

export function useLoginPasswordMutation() {
  return useMutation<ILoginSuccess, IHttpError, IPasswordLoginPayload>(
    (payload) => {
      return User.loginWithEmailAndPassword(payload).then((res) => res.data);
    },
  );
}

export function useRegisterPasswordMutation() {
  return useMutation<IRegisterSuccess, IHttpError, IPasswordRegisterPayload>(
    (payload) => {
      return User.registerWithEmailAndPassword(payload).then((res) => res.data);
    },
  );
}

export function useForgotPassword() {
  return useMutation<
    IForgotPasswordSuccess,
    IHttpError,
    IForgotPasswordPayload
  >((payload) => {
    return User.sendEmailForgotPassword(payload).then((res) => res.data);
  });
}

export function useResetPassword() {
  return useMutation<IResetPasswordSuccess, IHttpError, IResetPasswordPayload>(
    (payload) => {
      return User.resetPassword(payload).then((res) => res.data);
    },
  );
}

export function useLogout() {
  return useMutation(() => {
    return User.logout();
  });
}

export function useVerifyUser() {
  return useMutation<IVerifySuccess, IHttpError, IVerifyPayload>((payload) => {
    return User.verifyUser(payload).then((res) => res.data);
  });
}

export function useUpdateProfile() {
  return useMutation<IUpdateProfileSuccess, IHttpError, IUpdateProfilePayload>(
    (payload) => {
      return User.updateProfile(payload).then((res) => res.data);
    },
  );
}

export function useChangePasswordMutation() {
  return useMutation<
    IChangePasswordSuccess,
    IHttpError,
    IChangePasswordPayload
  >((payload) => {
    return User.changePasswordMutation(payload).then((res) => res.data);
  });
}

export function useLoginGoogle() {
  return useMutation(() => {
    return User.loginGoogle().then((res) => res.data);
  });
}

export function useLoginGoogleCallback() {
  return useMutation<ILoginSuccess, IHttpError, ISocialLoginParams>(
    (payload) => {
      return User.loginGoogleCallback(payload).then((res) => res.data);
    },
  );
}

export function useLoginFacebook() {
  return useMutation(() => {
    return User.loginFacebook().then((res) => res.data);
  });
}

export function useLoginFacebookCallback() {
  return useMutation<ILoginSuccess, IHttpError, ISocialLoginParams>(
    (payload) => {
      return User.loginFacebookCallback(payload).then((res) => res.data);
    },
  );
}
