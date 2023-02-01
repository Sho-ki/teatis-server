import { Survey } from '@prisma/client';
import { ActiveQuestionWithOptions, ActiveQuestionWithoutOptions } from './SurveyQuestion';

export type ActiveSurvey = Survey & {
  surveyQuestions: ActiveQuestionWithOptions[]|ActiveQuestionWithoutOptions[];
};

