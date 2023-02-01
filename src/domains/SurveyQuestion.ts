import { SurveyQuestion, SurveyQuestionOption } from '@prisma/client';
import { ProductFeature } from './Product';

export interface ActiveQuestionWithOptions extends SurveyQuestion {
    options: SurveyQuestionOption[] | ProductFeature[];
}

export interface ActiveQuestionWithoutOptions extends SurveyQuestion {
    options: undefined;
}
