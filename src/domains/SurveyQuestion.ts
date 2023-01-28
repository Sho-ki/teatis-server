import { SurveyQuestion, SurveyQuestionOption } from '@prisma/client';

export interface ActiveQuestion extends SurveyQuestion  {
      options: SurveyQuestionOption[];
}
