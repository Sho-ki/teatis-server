import { MonthlyBoxSelection } from '@prisma/client';
import { DisplayProduct } from './Product';

export interface MonthlyBoxSelectionProduct extends MonthlyBoxSelection {
    products:DisplayProduct[];
}
