import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePractitionerDto {
  @IsString()
    firstName: string;

  @IsString()
  @IsOptional()
    middleName?: string;

  @IsString()
  @IsOptional()
    lastName?: string;

  @IsString()
  @IsOptional()
    profileImage?: string;

  @IsString()
  @IsOptional()
    message?: string;

  @IsEmail()
    email: string;

  @IsString()
  @IsOptional()
    instagram?: string;

  @IsString()
  @IsOptional()
    facebook?: string;

  @IsString()
  @IsOptional()
    twitter?: string;

  @IsString()
  @IsOptional()
    website?: string;
}
