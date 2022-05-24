import { Question } from './Question';
import { Survey } from './Survey';

export interface SurveyQuestion extends Survey {
  surveyQuestions: Question[];
}
