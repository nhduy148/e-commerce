import * as config from "@hera/config";
import { ILoginSuccess } from "@hera/data";
import { JWTToken } from "@hera/types";
import { resetStorageKey } from "@hera/utils";
import * as Sentry from "@sentry/nextjs";
import jwtDecode from "jwt-decode";
import { createContext, useEffect, useState } from "react";

type AuthenticationState = {
  isLogin: boolean;
  userInfo: null | JWTToken;
  isChecking?: boolean;
};

type AuthenticationContextType = AuthenticationState & {
  onLogin: (
    data: ILoginSuccess,
    callback?: (data?: ILoginSuccess) => any,
  ) => any;
  onLogout: (callback?: () => void, stateChangeManually?: boolean) => any;
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
  isLogin: false,
  userInfo: null,
  isChecking: true,
  onLogin: (
    data: ILoginSuccess,
    callback?: (data?: ILoginSuccess) => any,
  ) => {},
  onLogout: (callback?: () => void, stateChangeManually?: boolean) => {},
});

export const AuthenticationProvider = ({ children }: { children: any }) => {
  const [authentication, setAuthentication] = useState<AuthenticationState>({
    isLogin: false,
    userInfo: null,
    isChecking: true,
  });
  useEffect(() => {
    const auth: ILoginSuccess = JSON.parse(
      localStorage.getItem(config.env.authKey) || "null",
    );

    if (auth) {
      setAuthentication({
        isLogin: true,
        userInfo: jwtDecode<JWTToken>(auth?.token),
        isChecking: false,
      });
      Sentry.setUser({ token: auth?.token });
      return;
    }
    Sentry.setUser({ token: null });
  }, []);

  const onLogin = (
    data: ILoginSuccess,
    callback?: (data?: ILoginSuccess) => any,
  ) => {
    const dataAuth = {
      timestamp: jwtDecode<JWTToken>(data?.token)?.exp || null,
      token: data.token || null,
    };
    localStorage.setItem(config.env.authKey, JSON.stringify(dataAuth));
    setAuthentication({
      isLogin: true,
      userInfo: jwtDecode<JWTToken>(data?.token) || {},
      isChecking: false,
    });
    if (typeof callback === "function") {
      callback(data);
    }
  };

  const onLogout = (callback?: () => void, stateChangeManually?: boolean) => {
    resetStorageKey();
    if (!stateChangeManually) {
      setAuthentication({ isLogin: false, userInfo: null, isChecking: false });
    }
    if (typeof callback === "function") {
      callback();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{ onLogin, onLogout, ...authentication }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
