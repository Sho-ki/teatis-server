import { CustomerType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCheckoutCartDto {
  @IsEnum(CustomerType)
    customerType: CustomerType = CustomerType.standard;

  @IsNumber()
  @IsOptional()
    deliveryInterval?: 1 | 3 | 6 | 12;

  @IsString()
  @IsOptional()
    size?: 'mini' | 'standard' | 'max';

  @IsString()
    uuid: string;

  @IsString()
  @IsOptional()
    practitionerBoxUuid?: string;

  @IsString()
  @IsOptional()
    discountCode?:string;

  @IsBoolean()
  @IsOptional()
    isOneTimePurchase?: boolean;

  @IsBoolean()
  @IsOptional()
    isWeightManagement?: boolean;
}

