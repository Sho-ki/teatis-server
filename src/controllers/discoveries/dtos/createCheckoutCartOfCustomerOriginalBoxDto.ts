import { IsEmail, IsString } from 'class-validator';

export class CreateCheckoutCartOfCustomerOriginalBoxDto {
  @IsString()
  merchandiseId: string;

  @IsString()
  sellingPlanId: string;

  @IsString()
  uuid: string;
}
