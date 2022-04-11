import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetNextBoxSurveyDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  uuid?: string;
}
