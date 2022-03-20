import { IsArray, IsEmail, IsString } from 'class-validator';

export class UpdateCustomerBoxDto {
  @IsArray()
  products: { id: number }[];

  @IsEmail()
  email: string;
}
