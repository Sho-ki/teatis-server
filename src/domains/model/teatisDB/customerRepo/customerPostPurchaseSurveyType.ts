import { LastOrderNumberAndProducts } from '../productRepo/productPostPurchaseSurvey';
import { SurveyQuestionIds } from '../questionRepo/questionPostPurchaseSurvey';

export interface Customer {
  id: number;
  email: string;
}

export interface GetPostPurchaseSurveyWithCustomerAnswer {
  email: string;
  lastProductsData: LastOrderNumberAndProducts;
  surveyQuestionIds: SurveyQuestionIds[];
}

export interface PostPostPurchaseSurveyWithCustomerAnswer {
  id: number;
  shopifyOrderNumber: string;
  questionCategory: string;
  answer?: string | number | number[] | boolean | undefined;
  reason?: string;
  surveyQuestionAnswerType: string;
}

export interface GetPostPurchaseSurveyWithCustomerAnswerRes {
  customerId?: number;
  id: number;
  name: string;
  label: string;
  questionCategoryId: number;
  questionCategory: QuestionCategory;
  mustBeAnswered: boolean;
  instruction: string | null;
  placeholder: string | null;
  surveyQuestionAnswerTypeId: number;
  surveyQuestionAnswerType: SurveyQuestionAnswerType;
  surveyQuestionOptions: SurveyQuestionOption[];
  answer?: string | number | number[] | boolean | undefined;
  productId?: number;
}

export interface QuestionCategory {
  label: string;
}

export interface SurveyQuestionAnswerType {
  label: string;
}

export interface SurveyQuestionOption {
  label: string | null;
}
