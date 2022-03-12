import { IsEmail, IsString } from 'class-validator';

export class UpdateCustomerBoxTaskDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
