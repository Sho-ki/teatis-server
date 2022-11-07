import { ProductHasGlucoseImpact } from './PostPurchaseSurvey';

export interface Answer {
  id: number;
  surveyQuestionId: number;
  answer?: {
    text?: string;
    numeric?: number;
    singleOptionId?: number;
    multipleOptionIds?: number[];
    bool?: boolean;
  };
  responseId: string;
  reason?: string;
  title?: string;
  content?: string;
  answerCount: number;
  productId?: number;
  orderNumber: string;
  glucoseImpact?: ProductHasGlucoseImpact;
}
