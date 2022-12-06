import { IsString } from 'class-validator';

export class SendCodeDto {
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
