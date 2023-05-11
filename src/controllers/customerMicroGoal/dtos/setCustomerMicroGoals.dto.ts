import { IsString } from 'class-validator';

export class SetCustomerMicroGoalsRequestDto {
  @IsString()
    uuid: string;

}

