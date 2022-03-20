import { IsEmail } from 'class-validator';

export class DeleteCustomerBoxDto {
  @IsEmail()
  email: string;
}
