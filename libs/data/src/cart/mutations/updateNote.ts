import { useMutation } from "react-query";
import { ICart } from "../../cart";
import { IHttpError, IResponse } from "../../core";
import { IUpdateNotePayload } from "../models";
import { updateNoteService } from "../services";

export function useUpdateNote() {
  return useMutation<IResponse<ICart>, IHttpError, IUpdateNotePayload>(
    updateNoteService,
  );
}
