import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePractitionerBoxDto {
  @IsNumber()
  practitionerId: number;

  @IsArray()
  products: { id: number }[];

  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
