export interface SurveyQuestions {
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
  answer_count?: number;
  shopifyOrderNumber?: string;
  productId?: number;
  customerId?: number;
}
export interface QuestionOptions {
  id: number;
  label: string;
}
