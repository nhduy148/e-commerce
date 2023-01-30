import { IResponse, Model, ObjectsFactory } from "../../core";
import { SUBMIT_SURVEY_FORM_ENDPOINT } from "../../endpoint";

export const FormBuilderTypes = [
  "textfield",
  "select",
  "radio",
  "checkbox",
] as const;

export type FormBuilderType = typeof FormBuilderTypes[number];

export interface IProductSurveyForm {
  id: number;
  isActive: boolean;
  name: string;
  content: IFormSection[];
}

export const FormBuilderValidations = ["required", "min", "max"] as const;

export type FormBuilderValidation = {
  [type in typeof FormBuilderValidations[number]]: number | boolean;
};

export type FormOption = {
  id: string;
  value: string;
};

export type IFormSection = {
  id: string;
  label: string;
  showLabel?: boolean;
  type: FormBuilderType;
  options: FormOption[];
  validations: FormBuilderValidation;
};

export interface IGetSampleShipping {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  provinceId: number | null;
  districtId: number | null;
  wardId: number | null;
  displayName: string;
}

export interface IAnswer {
  answer: string | number | string[] | number[];
  question: string;
}

export interface IFormDynamicContent {
  customerInfo: IGetSampleShipping;
  customerAnswer: {
    [key: string]: string;
  };
}

export interface IFormContent {
  customerInfo: IGetSampleShipping;
  customerAnswer: IAnswer[];
}

export interface ICreateSurveyPayload {
  productId: number;
  questionFormId: number;
  content: IFormContent;
  quantity: number;
}

export interface ICreateSurveyResponse {
  msg: "ok";
}

export class SurveyForm extends Model {
  static config = { endpoint: "/SurveyForm" };

  static objects = ObjectsFactory.factory<IFormSection>(this.config);

  static submitSurvey(payload: ICreateSurveyPayload) {
    return SurveyForm.service.post<IResponse<ICreateSurveyResponse>>({
      url: SUBMIT_SURVEY_FORM_ENDPOINT,
      payload,
    });
  }
}

SurveyForm.init(SurveyForm.config);
