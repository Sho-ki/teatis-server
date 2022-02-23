export interface CustomerProductFeedbackAnswers {
  id?: number;
  customerId?: number;
  surveyQuestionId?: number;
  answerSingleOptionId?: number;
  answerNumeric?: number;
  answerText?: string;
  answerBool?: boolean;
  reason?: string;
  title?: string;
  content?: string;
  answerCount?: number;
  productId?: number;
  shopifyOrderNumber?: string;
}
