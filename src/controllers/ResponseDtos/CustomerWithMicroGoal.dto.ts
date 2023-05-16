import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CustomerDto } from './Customer.dto';
import { NextDotExamMonthLeftDto } from './NextDotExamMonthLeft.dto';
import { MicroGoalDto } from './MicroGoal.dto';
import { CustomerType } from '@prisma/client';

export class CustomerWithMicroGoalDto implements CustomerDto, NextDotExamMonthLeftDto {
  @Expose()
    id: number;

  @Expose()
    uuid: string;

  @Expose()
    firstName: string;

  @Expose()
    lastName: string;

  @Expose()
    email: string;

  @Expose()
  @IsEnum(CustomerType)
    customerType: CustomerType;

  @Expose()
  @IsOptional()
    phone?: string;

  @Expose()
    nextDotExamMonthLeft: number;

  @Expose()
  @ValidateNested({ each: true })
    microGoals: MicroGoalDto[];
}
