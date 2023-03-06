import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetPractitionerBoxDto {
  @IsString()
  @IsOptional()
    practitionerBoxUuid?: string;

  @IsString()
  @IsOptional()
    label?: string;

  @IsEmail()
  @IsOptional()
    email?: string;
}
