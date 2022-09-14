import { IsEmail, IsString } from 'class-validator';

export class DeleteCustomerInformationDto {
  @IsEmail()
    email: string;

  @IsString()
    klaviyoListName: 'PotentialCustomer' | 'PotentialCustomerPractitioner' | 'PotentialCustomerCGM';
}
