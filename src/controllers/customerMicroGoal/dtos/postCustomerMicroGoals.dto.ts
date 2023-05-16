import { IsString } from 'class-validator';

export class PostCustomerMicroGoalsRequestDto {
  @IsString()
    uuid: string;

}

