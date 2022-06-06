import { IsEmail, IsString } from 'class-validator';

export class GetPractitionerDto {
  @IsEmail()
  email: string;
}
