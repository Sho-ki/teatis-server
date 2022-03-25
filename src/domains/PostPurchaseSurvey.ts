export class PostPurchaseSurvey {
  orderNumber: string;
  customerId: number;
  surveyQuestions: SurveyQuestions[];
}

export class SurveyQuestions {
  id: number;
  name: string;
  label: string;
  category: string;
  mustBeAnswered: boolean;
  instruction?: string;
  placeholder?: string;
  answerType: string;
  options?: QuestionOption[];
  answer: {
    text?: string;
    numeric?: number;
    singleOption?: QuestionOption;
    multipleOptions?: QuestionOption[];
    bool?: boolean;
  };
  reason?: string;
  title?: string;
  content?: string;

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
