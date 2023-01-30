import { useMutation } from "react-query";
import { IHttpError } from "../../core";
import { GetSample, IGetSamplePayload, IGetSampleSuccess } from "../models";

export function useGetSampleMutation() {
  return useMutation<IGetSampleSuccess, IHttpError, IGetSamplePayload>(
    (payload) => {
      return GetSample.getSampleRegister(payload).then((res) => res.data);
    },
  );
}
