import { Survey, SurveyQuestion, SurveyQuestionOption } from '@prisma/client';
import { ProductFeature } from './Product';

export type ActiveSurvey = Survey & {
  surveyQuestions: ActiveQuestionWithOptions[]|ActiveQuestionWithoutOptions[];
};

export interface ActiveQuestionWithOptions extends SurveyQuestion {
    options: SurveyQuestionOption[] | ProductFeature[];
}

export interface ActiveQuestionWithoutOptions extends SurveyQuestion {
    options: undefined;
}
