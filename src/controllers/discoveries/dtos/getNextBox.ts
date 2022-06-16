import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetNextBoxDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  uuid?: string;
}
