import { Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ActionStepDto } from './ActionStep.dto';

export class MicroGoalDto {
  @Expose()
    id: number;

  @Expose()
    label: string;

  @Expose()
    order: number;

  @Expose()
    category: string;

  @Expose()
  @ValidateNested({ each: true })
    actionSteps: ActionStepDto[];
}
