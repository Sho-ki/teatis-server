import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetRdBoxDto {
  @IsString()
  rdBoxId: string;
}
