import { Expose } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

class CustomerActionStep {
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
  @IsOptional()
    completedAt?: Date;

  @Expose()
  @IsOptional()
    imageUrl?: string;
}

class CustomerMicroGoal {
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
    actionSteps: CustomerActionStep[];
}

export class GetCustomerMicroGoalsResponseDto {
  @Expose()
    id: number;

  @Expose()
    uuid: string;

  @Expose()
    nextDotExamMonthLeft: number;

  @Expose()
    firstName: string;

  @Expose()
    lastName: string;

  @Expose()
  @ValidateNested({ each: true })
    microGoals: CustomerMicroGoal[];
}