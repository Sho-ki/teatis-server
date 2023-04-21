import { Country, CustomerType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class PostPrePurchaseSurveyDto {
  @IsEnum(CustomerType)
    customerType: CustomerType = CustomerType.standard;

  @IsNumber()
  @IsOptional()
    gender?: number;

  // @IsArray()
  //   categoryPreferences: number[];

  @IsArray()
    flavorDislikeIds: number[] = [];

  @IsArray()
    ingredientDislikeIds: number[] = [];

  @IsArray()
    allergenIds: number[] = [];

  @IsString()
    email: string;

  @ValidateIf(o => o.customerType === CustomerType.employee || o.customerType === CustomerType.driver)
  @IsPhoneNumber('US')
  @Transform(({ value }) => { return value.startsWith('+1')?value:  '+1' + value; })
    phone: string;

  @ValidateIf(o => o.customerType === CustomerType.employee || o.customerType === CustomerType.driver)
  @IsString()
    firstName: string;

  @ValidateIf(o => o.customerType === CustomerType.employee || o.customerType === CustomerType.driver)
  @IsString()
    lastName: string;

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
    address1: string;

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
  @IsOptional()
    address2?: string;

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
    city: string;

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
    state: string;

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
    zip: string;

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
    country: Country = 'US';

  @ValidateIf(o => o.customerType === CustomerType.employee)
  @IsString()
    employerUuid: string;
}
