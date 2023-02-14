import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMasterMonthlyBoxDto {
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

