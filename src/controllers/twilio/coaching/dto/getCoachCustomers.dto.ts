import { IsString } from 'class-validator';

export class GetCoachCustomersDto {
  @IsString()
    email:string;
}
