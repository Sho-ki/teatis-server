import { QuestionType, SurveyQuestionAnswer } from '@prisma/client';
import { Customer } from './Customer';
import { ProductHasGlucoseImpact } from './PostPurchaseSurvey';

// export interface Answer {
//   id: number;
//   surveyQuestionId: number;
//   answer?: {
//     text?: string;
//     numeric?: number;
//     singleOptionId?: number;
//     multipleOptionIds?: number[];
//     bool?: boolean;
//   };
//   responseId: string;
//   reason?: string;
//   title?: string;
//   content?: string;
//   answerCount: number;
//   productId?: number;
//   orderNumber: string;
//   glucoseImpact?: ProductHasGlucoseImpact;
// }

export type AnswerKeys = keyof Pick<SurveyQuestionAnswer, 'answerBool'|'answerCount'|'answerNumeric'|'answerOptionId'|'answerText'|'glucoseImpact'|'orderNumber'|'reason'|'productId'>;

export interface CustomerSurveyAnswer<T extends AnswerKeys> extends Customer {
    surveyQuestionAnswer: SurveyQuestionAnswer[];
    keys: T[];

}
