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

  // @IsNumber()
  // deliveryInterval: 1 | 3 | 6 | 12

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
}

export type CreateCheckoutCartDto = CustomerBoxDto | PractitionerBoxDto;
