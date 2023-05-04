import { MicroGoal, MicroGoalCategory, MicroGoalSubCategory } from '@prisma/client';

export interface MicroGoalWithCategory extends MicroGoal {
    subCategory: MicroGoalSubCategory;
    category: MicroGoalCategory;
}
