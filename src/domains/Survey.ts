import { Survey, SurveyQuestion, SurveyQuestionImage, SurveyQuestionOption } from '@prisma/client';
import { DisplayProduct, ProductFeature } from './Product';

export interface ActiveSurvey extends Survey {
  surveyQuestions: ParentSurveyQuestion[];
  pointToken?: string;
}

export type ParentSurveyQuestion = ParentSurveyQuestionWithOption | ParentSurveyQuestionWithoutOption;
export type ChildSurveyQuestion = ChildSurveyQuestionWithOption | ChildSurveyQuestionWithoutOption;

export interface ParentSurveyQuestionWithOption extends SurveyQuestion {
  images: SurveyQuestionImage[];
  options: SurveyQuestionOption[] | ProductFeature[];
  product?: DisplayProduct;
  customerResponse? : number[] | number | string | null;
  children?: ChildSurveyQuestion[];
}

export interface ParentSurveyQuestionWithoutOption extends SurveyQuestion {
  images: SurveyQuestionImage[];
  options: undefined;
  product?: DisplayProduct;
  customerResponse? :  number[] | number | string | null;
  children?: ChildSurveyQuestion[];
}

export interface ChildSurveyQuestionWithOption extends Omit<SurveyQuestion, 'product'> {
  images: SurveyQuestionImage[];
  options: SurveyQuestionOption[] | ProductFeature[];
  customerResponse? :  number[] | number | string | null;
}

export interface ChildSurveyQuestionWithoutOption extends Omit<SurveyQuestion, 'product'> {
  images: SurveyQuestionImage[];
  options: undefined;
  customerResponse? :  number[] | number | string | null;
}
