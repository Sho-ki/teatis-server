import {
  CustomerMicroGoal,
  MicroGoal,
  MicroGoalCategory,
} from '@prisma/client';
import { CustomerActionStepWithImage } from './CustomerActionStepWithImage';
import { ActionStepWithImage } from './ActionStepWithImage';

export interface CustomerMicroGoalWithActionSteps
  extends CustomerMicroGoal,
    Pick<MicroGoal, 'label'> {
      category: MicroGoalCategory;
      actionSteps: ActionStepWithImage[];
      customerActionSteps: CustomerActionStepWithImage[];
}
