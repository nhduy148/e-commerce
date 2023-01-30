import { useMutation } from "react-query";
import { IHttpError, IResponse } from "../../core";
import {
  ICreateSurveyPayload,
  ICreateSurveyResponse,
  SurveyForm,
} from "../models";

export function useSubmitSurveyFormMutation() {
  return useMutation<
    IResponse<ICreateSurveyResponse>,
    IHttpError,
    ICreateSurveyPayload
  >(SurveyForm.submitSurvey);
}
