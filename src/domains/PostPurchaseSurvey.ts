export class PostPurchaseSurvey {
  id: number;
  name: string;
  label: string;
  order?: number;
  questionCategory: { id: number; name: string; label: string };
  mustBeAnswered: boolean;
  instruction?: string;
  placeholder?: string;

  surveyQuestionAnswerType: { id: number; name: string; label: string };
  surveyQuestionOptions?: QuestionOption[];
  answer?: {
    text?: string;
    numeric?: number;
    singleOption?: QuestionOption;
    multipleOptions?: QuestionOption[];
    bool?: boolean;
  };
  reason?: string;
  title?: string;
  content?: string;
  answerCount?: number;
  shopifyOrderNumber?: string;
  customerId: number;
  product?: {
    id: number;
    label: string;
    vendor: string;
    images: { src: string; position: number }[];
  };
}

class QuestionOption {
  id: number;
  name: string;
  label: string;
}
