import { sentryErrorBoundary } from "@hera/utils";
import { IResponse, Model, ObjectsFactory } from "../../core";
import {
  CHANGE_PASSWORD_ENDPOINT,
  FACEBOOK_CALLBACK_ENDPOINT,
  FACEBOOK_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
  GET_CURRENT_USER_ENDPOINT,
  GOOGLE_CALLBACK_ENDPOINT,
  GOOGLE_ENDPOINT,
  LOGOUT_ENDPOINT,
  PASSWORD_LOGIN_ENDPOINT,
  PASSWORD_REGISTER_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
  UPDATE_PROFILE_ENDPOINT,
  VERIFY_ENDPOINT,
} from "../../endpoint";

export interface IPasswordLoginPayload {
  email: string;
  password: string;
}

export interface IPasswordRegisterPayload {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface IResetPasswordSuccess {
  status: string;
}

export interface ILoginSuccess {
  token: string;
  status: string;
}

export interface IRegisterSuccess {
  token: string;
  status: string;
}

export interface IForgotPasswordSuccess {
  message: string;
}

export interface IUserInfo {
  avatar: string;
  dob: string;
  email: string;
  firstName?: string;
  gender: string;
  id: number;
  isActive: boolean;
  isVerified: boolean;
  lastName?: string;
  passwordBlank: string;
  phone: string;
  pointLoyalty?: number;
}

export interface IUserData<T> {
  data: T;
}

export interface IVerifyPayload {
  email: string;
  code: string;
}

export interface IVerifySuccess {
  status: string;
}

export interface IUpdateProfileSuccess {
  status: string;
}

export interface IUpdateProfilePayload extends IUserInfo {}

export interface IUser {
  user: IUserInfo;
}

export interface IAddressFragment {
  code: string;
  id: number;
  name: string;
}

export interface IUserShippingAddress {
  addressLine: string;
  district: IAddressFragment;
  firstName: string;
  id: number;
  isDefault: boolean;
  lastName: string;
  phone: string;
  province?: IAddressFragment;
  ward: IAddressFragment;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordSuccess {
  status: string;
}

export interface ISocialLogin {
  url: string;
}

export interface ISocialLoginParams {
  code: string;
}
export class User extends Model {
  static config = { endpoint: "/users" };

  static objects = ObjectsFactory.factory<IUser>(User.config);

  /**
   * Login by username (email) and password
   * @param {string} email
   * @param {string} password
   * @return {Promise<T>}
   */

  static loginWithEmailAndPassword(payload: IPasswordLoginPayload) {
    const sentry = sentryErrorBoundary({
      name: "loginWithEmailAndPassword",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.post<IResponse<ILoginSuccess>>({
      url: PASSWORD_LOGIN_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static registerWithEmailAndPassword(payload: IPasswordRegisterPayload) {
    const sentry = sentryErrorBoundary({
      name: "registerWithEmailAndPassword",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.post<IResponse<IRegisterSuccess>>({
      url: PASSWORD_REGISTER_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static sendEmailForgotPassword(payload: IForgotPasswordPayload) {
    const sentry = sentryErrorBoundary({
      name: "sendEmailForgotPassword",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.post<IResponse<IForgotPasswordSuccess>>({
      url: FORGOT_PASSWORD_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static resetPassword(payload: IResetPasswordPayload) {
    const sentry = sentryErrorBoundary({
      name: "resetPassword",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.post<IResponse<IResetPasswordSuccess>>({
      url: RESET_PASSWORD_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static logout() {
    const sentry = sentryErrorBoundary({
      name: "logout",
      type: "Authentication",
    });
    const response = this.service.delete({
      url: LOGOUT_ENDPOINT,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static getCurrentUser() {
    const sentry = sentryErrorBoundary({
      name: "getCurrentUser",
      type: "Authentication",
    });
    const response = this.service.get<IResponse<IUser>>({
      url: GET_CURRENT_USER_ENDPOINT,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static verifyUser(payload: IVerifyPayload) {
    const sentry = sentryErrorBoundary({
      name: "verifyUser",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.post<IResponse<IVerifySuccess>>({
      url: VERIFY_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static updateProfile(payload: IUpdateProfilePayload) {
    const sentry = sentryErrorBoundary({
      name: "updateProfile",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.put<IResponse<IUpdateProfileSuccess>>({
      url: UPDATE_PROFILE_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static changePasswordMutation(payload: IChangePasswordPayload) {
    const sentry = sentryErrorBoundary({
      name: "changePasswordMutation",
      type: "Authentication",
      data: payload,
    });
    const response = this.service.put<IResponse<IUpdateProfileSuccess>>({
      url: CHANGE_PASSWORD_ENDPOINT,
      payload,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static loginGoogle() {
    const sentry = sentryErrorBoundary({
      name: "loginGoogle",
      type: "Authentication",
    });
    const response = this.service.get<IResponse<ISocialLogin>>({
      url: GOOGLE_ENDPOINT,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static loginGoogleCallback(params: ISocialLoginParams) {
    const sentry = sentryErrorBoundary({
      name: "loginGoogleCallback",
      type: "Authentication",
    });
    const response = this.service.get<IResponse<ILoginSuccess>>({
      url: GOOGLE_CALLBACK_ENDPOINT,
      params,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static loginFacebook() {
    const sentry = sentryErrorBoundary({
      name: "loginFacebook",
      type: "Authentication",
    });
    const response = this.service.get<IResponse<ISocialLogin>>({
      url: FACEBOOK_ENDPOINT,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }

  static loginFacebookCallback(params: ISocialLoginParams) {
    const sentry = sentryErrorBoundary({
      name: "loginFacebookCallback",
      type: "Authentication",
    });
    const response = this.service.get<IResponse<ILoginSuccess>>({
      url: FACEBOOK_CALLBACK_ENDPOINT,
      params,
    });
    response.catch(sentry.captureException).finally(sentry.end);
    return response;
  }
}

User.init(User.config);
