import { CustomerActionStep, CustomerActionStepImage } from '@prisma/client';

export interface CustomerActionStepWithImage extends CustomerActionStep {
    customerActionStepImage?: CustomerActionStepImage[];
}
