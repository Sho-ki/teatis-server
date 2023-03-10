import { SurveyQuestion, SurveyQuestionOption, SurveyQuestionResponse } from '@prisma/client';

export interface SurveyQuestionResponsesWithSurveyQuestionOptions extends SurveyQuestionResponse  {
    surveyQuestion: SurveyQuestion & {
        surveyQuestionOptions: SurveyQuestionOption[];
    };
}
