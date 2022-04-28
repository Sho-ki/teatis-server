import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerOrderDto {
  @IsString()
  name: string;

  @IsObject()
  customer: { email: string; id: number };

  @IsArray()
  line_items: { product_id: number }[];

  @IsArray()
  @IsOptional()
  note_attributes?: { key: string; value: string }[];
}
