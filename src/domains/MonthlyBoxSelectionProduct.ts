import { MonthlyBoxSelection } from '@prisma/client';
import { Product } from './Product';

export interface MonthlyBoxSelectionProduct extends MonthlyBoxSelection {
    product:Product[];
}
