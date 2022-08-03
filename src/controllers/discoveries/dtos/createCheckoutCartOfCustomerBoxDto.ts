import { IsNumber, IsString } from 'class-validator';

export class CustomerBoxDto{
  @IsString()
  boxType: 'CustomerBox'

  @IsNumber()
  deliveryInterval: 1 | 3 | 6 | 12

  @IsString()
  uuid: string;
  
  @IsString()
  boxName: "HC" | "HCLS"
}

export class PractitionerBoxDto{
  @IsString()
  boxType: 'PractitionerBox'

  // @IsNumber()
  // deliveryInterval: 1 | 3 | 6 | 12

  @IsString()
  uuid: string;

  @IsString()
  practitionerBoxUuid: string;
}

export type CreateCheckoutCartDto = CustomerBoxDto | PractitionerBoxDto
