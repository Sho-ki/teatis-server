import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CustomerMicroGoals {
  @Expose()
    id: number;

  @Expose()
    label: string;

  @Expose()
    order: number;

  @Expose()
    category: string;
}

export class SetCustomerMicroGoalsResponseDto {
  @Expose()
    id: number;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CustomerMicroGoals)
    customerMicroGoals: CustomerMicroGoals[];
}
