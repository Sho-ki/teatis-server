import { Expose } from 'class-transformer';

export class ActionStepSummaryDto {
  @Expose()
    id: number;

  @Expose()
    completedAt: Date | null;

}
