import { ActionStepWithImage } from './ActionStepWithImage';
import { CustomerActionStepWithImage } from './CustomerActionStepWithImage';

export interface CustomerActionStepWithOriginal {
    actionStep: ActionStepWithImage;
    customerActionStep: CustomerActionStepWithImage;
}
