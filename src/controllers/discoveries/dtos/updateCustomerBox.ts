import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerBoxDto {
  @IsArray()
    products: { id: number }[];

  @IsEmail()
  @IsOptional()
    email?: string;

  @IsString()
  @IsOptional()
    uuid?: string;
}
