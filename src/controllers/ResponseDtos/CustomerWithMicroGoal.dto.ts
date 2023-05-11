import { Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CustomerDto } from './Customer.dto';
import { NextDotExamMonthLeftDto } from './NextDotExamMonthLeft.dto';
import { MicroGoalDto } from './MicroGoal.dto';

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
    nextDotExamMonthLeft: number;

  @Expose()
  @ValidateNested({ each: true })
    microGoals: MicroGoalDto[];
}
