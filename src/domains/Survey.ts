import { Survey } from '@prisma/client';
import { ActiveQuestion } from './SurveyQuestion';

export type ActiveSurvey = Survey & {
  surveyQuestions: ActiveQuestion[];
};

