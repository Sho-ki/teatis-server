import {
  ActionStep,
  ActionStepImage,
  MicroGoal,
  MicroGoalCategory,
  MicroGoalSubCategory,
} from '@prisma/client';

interface ActionStepWithImageUrls extends ActionStep {
  actionStepImage: ActionStepImage[];
}

export interface MicroGoalWithActionSteps extends MicroGoal {
  subCategory: MicroGoalSubCategory;
  category: MicroGoalCategory;
  actionSteps: ActionStepWithImageUrls[];
}
