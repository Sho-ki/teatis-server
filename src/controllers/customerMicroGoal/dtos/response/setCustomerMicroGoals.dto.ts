import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class CustomerActionStep {
  @Expose()
    id: number;

  @Expose()
    order: number;

  @Expose()
    mainText: string;

  @Expose()
    subText?: string;

  @Expose()
    reason: string;
}

class CustomerMicroGoals {
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
  @Type(() => CustomerActionStep)
    actionSteps: CustomerActionStep[];
}

export class SetCustomerMicroGoalsResponseDto {
  @Expose()
    id: number;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CustomerMicroGoals)
    customerMicroGoals: CustomerMicroGoals[];
}
