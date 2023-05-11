import {
  ActionStep,
  ActionStepImage,
  CustomerActionStep,
  CustomerActionStepImage,
  CustomerMicroGoal,
  MicroGoal,
  MicroGoalCategory,
} from '@prisma/client';

export interface CustomerMicroGoalWithActionSteps
  extends CustomerMicroGoal,
    Pick<MicroGoal, 'label'> {
      category: MicroGoalCategory;
      actionSteps: (ActionStep & { actionStepImage?: ActionStepImage[] })[];
      customerActionSteps: (CustomerActionStep & {
        customerActionStepImage?: CustomerActionStepImage[];
  })[];
}
