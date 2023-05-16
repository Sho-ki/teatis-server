import { ActionStep, ActionStepImage } from '@prisma/client';

export interface ActionStepWithImage extends ActionStep {
    actionStepImage?: ActionStepImage[];
}
