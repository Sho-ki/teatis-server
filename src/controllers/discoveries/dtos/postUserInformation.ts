import { IsEmail, IsString } from 'class-validator';

export class PostUserInformationDto {
  @IsEmail()
  email: string;

  @IsString()
  customerUuid: string;

  @IsString()
  recommendBoxType: string;

  @IsString()
  klaviyoListName: "PotentialCustomer" | "PotentialCustomerPractitioner";
}
