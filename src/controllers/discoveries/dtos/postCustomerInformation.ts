import { IsEmail, IsString } from 'class-validator';

export class PostCustomerInformationDto {
  @IsEmail()
    email: string;

  @IsString()
    customerUuid: string;

  @IsString()
    recommendBoxType: string;

  @IsString()
    klaviyoListName: 'PotentialCustomer' | 'PotentialCustomerPractitioner';
}
