import { IsString } from 'class-validator';

export class CreateCheckoutCartOfPractitionerBoxOldDto {
  @IsString()
  merchandiseId: string;

  @IsString()
  sellingPlanId: string;

  //  CustomerUuid
  @IsString()
  uuid: string;

  @IsString()
  practitionerBoxUuid: string;
}
