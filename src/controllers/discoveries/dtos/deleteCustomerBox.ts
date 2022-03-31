import { IsEmail, IsString } from 'class-validator';

export class DeleteCustomerBoxDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
