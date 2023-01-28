import { Survey } from '@prisma/client';
import { ActiveQuestion } from './SurveyQuestion';

export interface SurveyWithActiveQuestions extends Survey {
      surveyQuestions: ActiveQuestion[];
}

// {
//   id: number;
//   name: string;
//   label: string;
// }
