import { IsString } from 'class-validator';

export class CreateCheckoutCartOfPractitionerBoxDto {
  @IsString()
  merchandiseId: string;

  @IsString()
  sellingPlanId: string;

  @IsString()
  practitionerBoxUuid: string;
}
