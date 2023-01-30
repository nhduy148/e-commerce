import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { User } from "../models";
import { IUser } from "./../models";

export const CURRENT_USER = "CURRENT_USER";

export function useCurrentUser(enabled: boolean = false) {
  return useQuery<IUser, IHttpError>({
    queryKey: [CURRENT_USER],
    queryFn() {
      return User.getCurrentUser().then((res) => res.data);
    },
    enabled,
  });
}
