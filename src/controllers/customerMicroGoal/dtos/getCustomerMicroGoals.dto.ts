import { IsString } from 'class-validator';

export class GetCustomerMicroGoalsRequestDto {
  @IsString()
    uuid: string;
}
