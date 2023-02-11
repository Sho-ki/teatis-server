import { CustomerSurveyHistory, SurveyQuestionResponse } from '@prisma/client';

export interface CustomerSurveyHistoryAndResponses extends CustomerSurveyHistory  {
    surveyQuestionResponse: SurveyQuestionResponse[];
}
