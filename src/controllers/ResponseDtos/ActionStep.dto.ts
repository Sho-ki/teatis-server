import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ActionStepDto {
  @Expose()
    id: number;

  @Expose()
    order: number;

  @Expose()
    mainText: string;

  @Expose()
  @IsOptional()
    subText?: string;

  @Expose()
    reason: string;

  @Expose()
    completedAt: Date | null;

  @Expose()
  @IsOptional()
    imageUrl?: string;
}

