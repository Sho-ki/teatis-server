import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomerBoxDto{
  @IsString()
    boxType: 'CustomerBox';

  @IsNumber()
    deliveryInterval: 1 | 3 | 6 | 12;

  @IsString()
    uuid: string;

  @IsString()
    boxName: 'HC' | 'HCLS';

  @IsString()
  @IsOptional()
    discountCode?:string;
}

export class PractitionerBoxDto{
  @IsString()
    boxType: 'PractitionerBox';

  @IsString()
    uuid: string;

  @IsString()
    practitionerBoxUuid: string;

  @IsString()
  @IsOptional()
    discountCode?:string;

  @IsBoolean()
  @IsOptional()
    isOneTimePurchase?: boolean;

  @IsNumber()
  @IsOptional()
    deliveryInterval?: 1 | 12;

}

export type CreateCheckoutCartDto = CustomerBoxDto | PractitionerBoxDto;
