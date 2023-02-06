import { Survey, SurveyQuestion, SurveyQuestionOption } from '@prisma/client';
import { DisplayProduct, ProductFeature } from './Product';

export interface ActiveSurvey extends Survey {
  surveyQuestions: ParentSurveyQuestion[];
}

export type ParentSurveyQuestion = ParentSurveyQuestionWithOption | ParentSurveyQuestionWithoutOption;
export type ChildSurveyQuestion = ChildSurveyQuestionWithOption | ChildSurveyQuestionWithoutOption;

export interface ParentSurveyQuestionWithOption extends SurveyQuestion {
  options: SurveyQuestionOption[] | ProductFeature[];
  product?: DisplayProduct;
  customerResponse? : unknown | null;
  children?: ChildSurveyQuestion[];
}

export interface ParentSurveyQuestionWithoutOption extends SurveyQuestion {
  options: undefined;
  product?: DisplayProduct;
  customerResponse? : unknown | null;
  children?: ChildSurveyQuestion[];
}

export interface ChildSurveyQuestionWithOption extends Omit<SurveyQuestion, 'product'> {
  options: SurveyQuestionOption[] | ProductFeature[];
  customerResponse? : unknown | null;
}

export interface ChildSurveyQuestionWithoutOption extends Omit<SurveyQuestion, 'product'> {
  options: undefined;
  customerResponse? : unknown | null;
}
