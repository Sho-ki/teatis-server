import { SurveyQuestion, SurveyQuestionOption, SurveyQuestionResponse } from '@prisma/client';

export interface SurveyQuestionResponsesWithOptions extends SurveyQuestionResponse  {
    surveyQuestion: SurveyQuestion & {
        surveyQuestionOptions: SurveyQuestionOption[];
    };
}
