import {  SurveyQuestionResponse } from '@prisma/client';
import { Product } from './Product';

export interface ProductSurveyQuestionResponse extends SurveyQuestionResponse {
    product: Product;
}
