import { ActiveQuestion } from './SurveyQuestion';

export interface PostPurchaseSurvey {
  orderNumber: string;
  customerId: number;
  redirectEndpoint:string;
  surveyQuestions: ActiveQuestion[];
}

// export interface SurveyQuestions {
//   id: number;
//   responseId: string;
//   name: string;
//   label: string;
//   mustBeAnswered: boolean;
//   instruction?: string;
//   placeholder?: string;
//   answerType: string;
//   options?: QuestionOption[];
//   answer: {
//     text?: string;
//     numeric?: number;
//     singleOption?: QuestionOption;
//     multipleOptions?: QuestionOption[];
//     bool?: boolean;
//   };
//   reason?: string;
//   title?: string;
//   content?: string;
//   glucoseImpact?: ProductHasGlucoseImpact;
//   product?: {
//     id: number;
//     label: string;
//     vendor: string;
//     images: { src: string, position: number }[];
//   };
// }

// interface QuestionOption {
//   id: number;
//   name: string;
//   label: string;
// }

// export enum ProductHasGlucoseImpact {
//   Unknown = -1,
//   Yes = 1,
//   No = 2,
// }
