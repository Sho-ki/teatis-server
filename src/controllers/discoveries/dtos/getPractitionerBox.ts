import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetPractitionerBoxDto {
  @IsString()
  practitionerBoxUuid: string;
}
