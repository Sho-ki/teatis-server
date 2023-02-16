import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

enum CustomerType {
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
}

export class PostPrePurchaseSurveyDto {
  @IsEnum(CustomerType)
    customerType: CustomerType;

  @IsNumber()
  @IsOptional()
    gender?: number;

  // @IsArray()
  //   categoryPreferences: number[];

  @IsArray()
    flavorDislikeIds: number[];

  @IsArray()
    ingredientDislikeIds: number[];

  @IsArray()
    allergenIds: number[];

  @IsString()
    email: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    phoneNumber: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    firstName: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    lastName: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    address1: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
  @IsOptional()
    address2?: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    city: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    state: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    zip: string;

  @ValidateIf(o => o.customerType === CustomerType.EMPLOYEE)
  @IsString()
    country: string;
}
