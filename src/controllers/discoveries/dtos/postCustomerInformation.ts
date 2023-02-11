import { IsEmail, IsString } from 'class-validator';
import { KlaviyoListNames } from '@Domains/KlaviyoListNames';
export class PostCustomerInformationDto {
  @IsEmail()
    email: string;

  @IsString()
    customerUuid: string;

  @IsString()
    klaviyoListName: KlaviyoListNames;
}
