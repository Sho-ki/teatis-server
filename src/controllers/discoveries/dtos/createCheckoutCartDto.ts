import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCheckoutCartDto {
  @IsNumber()
    deliveryInterval: 1 | 3 | 6 | 12;

  @IsString()
    size: 'mini' | 'standard' | 'max';

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

