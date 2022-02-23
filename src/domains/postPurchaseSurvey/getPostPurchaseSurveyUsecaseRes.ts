export interface GetPostPurchaseSurveyUsecaseRes {
  id: number;
  name: string;
  label: string;
  questionCategoryId: number;
  questionCategory: string;
  mustBeAnswered: boolean;
  instruction: string | null;
  placeholder: string | null;
  surveyQuestionAnswerTypeId: number;
  surveyQuestionAnswerType: string;
  surveyQuestionOptions: QuestionOptions[];
  answerText?: string;
  answerNumeric?: number;
  answerSingleOptionId?: number;
  answerOptions?: QuestionOptions[];
  answerBool?: boolean;
  reason?: string;
  title?: string;
  content?: string;
  answerCount?: number;
  shopifyOrderNumber?: string;
  productId?: number;
  customerId: number;
}

interface QuestionOptions {
  id: number;
  label: string;
}

export interface GetPostPurchaseSurveyUsecaseArgs {
  email: string;
  orderNumber?: string;
}
