import { SurveyQuestion, SurveyQuestionOption } from '@prisma/client';

export interface ActiveQuestionWithOptions extends SurveyQuestion {
    options: SurveyQuestionOption[];
}

export interface ActiveQuestionWithoutOptions extends SurveyQuestion {
    options: undefined;
}
