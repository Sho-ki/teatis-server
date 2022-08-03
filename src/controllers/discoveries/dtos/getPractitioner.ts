import { IsEmail } from 'class-validator';

export class GetPractitionerDto {
  @IsEmail()
    email: string;
}
