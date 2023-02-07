import { Survey, SurveyQuestion, SurveyQuestionImage, SurveyQuestionOption } from '@prisma/client';
import { DisplayProduct, ProductFeature } from './Product';

export interface ActiveSurvey extends Survey {
  surveyQuestions: ParentSurveyQuestion[];
}

export type ParentSurveyQuestion = ParentSurveyQuestionWithOption | ParentSurveyQuestionWithoutOption;
export type ChildSurveyQuestion = ChildSurveyQuestionWithOption | ChildSurveyQuestionWithoutOption;

export interface ParentSurveyQuestionWithOption extends SurveyQuestion {
  images: SurveyQuestionImage[];
  options: SurveyQuestionOption[] | ProductFeature[];
  product?: DisplayProduct;
  customerResponse? : unknown | null;
  children?: ChildSurveyQuestion[];
}

export interface ParentSurveyQuestionWithoutOption extends SurveyQuestion {
  images: SurveyQuestionImage[];
  options: undefined;
  product?: DisplayProduct;
  customerResponse? : unknown | null;
  children?: ChildSurveyQuestion[];
}

export interface ChildSurveyQuestionWithOption extends Omit<SurveyQuestion, 'product'> {
  images: SurveyQuestionImage[];
  options: SurveyQuestionOption[] | ProductFeature[];
  customerResponse? : unknown | null;
}

export interface ChildSurveyQuestionWithoutOption extends Omit<SurveyQuestion, 'product'> {
  images: SurveyQuestionImage[];
  options: undefined;
  customerResponse? : unknown | null;
}
